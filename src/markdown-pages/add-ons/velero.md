---
path: "/docs/add-ons/velero"
date: "2019-11-20"
linktitle: "Velero Add-On"
weight: 46
title: "Velero Add-On"
addOn: "velero"
---

The [Velero](https://velero.io/) add-on is a tool for cluster operators to backup Kubernetes namespaces and data.

The Kurl add-on installs:
* The velero server into the velero namespace
* The velero CLI onto the host
* CRDs for configuring backups and restores

## Advanced Install Options

```yaml
spec:
  velero:
    version: "latest"
    namespace: "velero"
    disableRestic: true
    disableCLI: true
    localBucket: "local"
    resticRequiresPrivileged: true
```

flags-table

## Cluster Operator Tasks

This section describes tasks for cluster operators using Velero to backup resources and data in their cluster.
Refer to the [Velero documentation](https://velero.io/docs/) for more advanced topics, including help on scheduling recurring backups and troubleshooting.

### Configure Backend Object Store

Velero requires a backend object store where it will save your backups. It can alternatively be set up to use a persistent volume for storage.

For the initial install, a storage location inside the cluster will be used as the default. The storage location will be determined in this order of precedence:
1. If the `kotsadm.disableS3` flag is set to `true` in the installer spec, a persistent volume (PV) will be used as the storage backend.
1. If present, an object storage provider in the cluster will be used as the storage backend. This can be satisfied by the Rook or MinIO add-ons.
1. Otherwise, no default storage location will be configured.

You can also decide to move between these **Internal Storage** locations. See [Removing Object Storage](/docs/install-with-kurl/removing-object-storage) for more information on this migration.

None of these **Internal Storage** locations are suitable for disaster recovery, because the loss of the cluster will mean the loss of backups. Therefore, it is recommended you use an external storage location.

The add-on includes plugins for using AWS, Azure, or GCP object stores as backends, as well as the [local-volume-provider](https://github.com/replicatedhq/local-volume-provider) plugin for direct-to-disk backups.

#### AWS S3

Create a [BackupStorageLocation](https://velero.io/docs/main/api-types/backupstoragelocation/) in the `velero` namespace with your S3 configuration:

```bash
velero backup-location create my-aws-backend --bucket my-s3-bucket --provider aws --config region=us-east-2
```

You must create a secret named `aws-credentials` in the velero namespace unless using instance profiles. You may need to delete the secret of the same name created by the initial install for the local ceph object store.


1. Create a file that holds the credentials for your AWS IAM user following the [standard AWS credentials file format](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

2. Create a secret named `aws-credentials` in the `velero` namespace from this file:

```bash
kubectl -n velero create secret generic aws-credentials --from-file=cloud=<path-to-file>
```

The minimum policy permissions required for this IAM user are:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:AbortMultipartUpload",
                "s3:DeleteObject",
                "s3:ListMultipartUploadParts"
            ],
            "Resource": "arn:aws:s3:::my-s3-bucket/*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::my-s3-bucket"
        }
    ]
}
```

#### S3-Compatible

S3-Compatible object stores can be used with the AWS provider.
Follow the steps above to create a secret named `aws-credentials` in the `velero` namespace with the store's credentials.
Then use the velero CLI to create a backup-location with the `s3Url` config option to specify the endpoint.

```bash
velero backup-location create local-ceph-rgw --bucket snapshots --provider aws --config s3Url=http://$CLUSTER_IP,region=us-east-1
```

#### Azure

Refer to [Velero's Azure plugin documentation](https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure#create-azure-storage-account-and-blob-container) for help with creating a storage account and blob container.
Then you can configure a backup-location with credentials using the following commands:

```bash
velero backup-location create my-azure-backend --provider azure --config resourceGroup=$AZURE_BACKUP_RESOURCE_GROUP,storageAccount=$AZURE_STORAGE_ACCOUNT_ID,subscriptionId=$AZURE_BACKUP_SUBSCRIPTION_ID --bucket $BLOB_CONTAINER
```

You must create a secret named 'azure-credentials' in the velero namespace.

```bash
cat << EOF  > ./credentials-velero
AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}
AZURE_TENANT_ID=${AZURE_TENANT_ID}
AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
AZURE_RESOURCE_GROUP=${AZURE_RESOURCE_GROUP}
AZURE_CLOUD_NAME=AzurePublicCloud
EOF

kubectl -n velero create secret generic azure-credentials --from-file=cloud=credentials-velero
```

#### Google

```bash
velero backup-location create my-google-backend --provider gcp --bucket my-gcs-bucket
```

You must create a secret named `google-credentials` in the velero namespace.

1. Create a file named `credentials-velero` holding the contents of an [authorized service account](https://github.com/vmware-tanzu/velero-plugin-for-gcp#option-1-set-permissions-with-a-service-account).

2. Create the secret from the file

```bash
kubectl -n velero create secret generic google-credentials --from-file=cloud=./credentials-velero
```

### Local-Volume-Provider

The [local-volume-provider](https://github.com/replicatedhq/local-volume-provider) plugin can be used to store snapshots directly on the host machine (hostpath) or to a Network File Share (NFS) location. 

Hostpath backups are only recommended for SINGLE NODE clusters that will never be extended with more nodes. To create a hostpath backup location:

```bash
velero backup-location create my-hostpath-backend --provider replicated.com/hostpath --bucket <friendly volume name> --config path=</path/to/hostpath>,resticRepoPrefix=/var/local-volume-provider/<bucket>/restic
```

To create an NFS backup location:

```bash
velero backup-location create my-nfs-backend --provider replicated.com/nfs --bucket <friendly volume name> --config path=</path/on/share>,server=<server host or ip>,resticRepoPrefix=/var/local-volume-provider/<bucket>/restic
```

### Create a Single Backup with the CLI

```bash
velero backup create my-backup-1 --storage-location my-aws-backend --include-namespaces my-app-namespace
```

### Restore from a Backup with the CLI

```bash
velero create restore restore-1 --from-backup my-backup-1
```

## Application Vendor Tasks

This section describes how authors of Kubernetes yaml must annotate their Pods in order for data to be included in backups.
If you are a cluster operator using Velero to backup a KOTS app then the application vendor will already have applied the required annotations to their Pods.

Include a Pod volume in backups by adding the `backup.velero.io/backup-volumes` annotation to the Pod spec:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample
  labels:
    app: foo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: foo
  template:
    metadata:
      labels:
        app: foo
      annotations:
        backup.velero.io/backup-volumes: pvc-volume,scratch
    spec:
      containers:
      - image: k8s.gcr.io/test-webserver
        name: test-webserver
        volumeMounts:
        - name: data
          mountPath: /volume-1
        - name: scratch
          mountPath: /volume-2
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: test-volume-claim
      - name: scratch
        emptyDir: {}
```
