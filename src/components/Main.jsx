import * as React from "react";
import autoBind from "react-autobind";
import { withRouter } from "react-router-dom";

import MonacoEditor from "react-monaco-editor";
import Select from "react-select";

import "../scss/components/Main";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kubernetesVersions: [
        {version: "0.15.0"}
      ],
      selectedVersion: 0,
      kubernetesYaml: `apiVersion: kurl.sh/v1beta1
      kind: Installer
      metadata:
        name: ""
      spec:
        kubernetes:
          version: "1.15.1"
        weave:
          version: "2.5.2"
        rook:
          version: "1.0.4"
        contour:
          version: "0.14.0"`

    };
    autoBind(this);
  }

  onVersionChange = (selectedVersion) => {
    this.setState({ selectedVersion });
  }

  render() {
    return (
      <div className="u-minHeight--full u-width--full u-overflow--auto container flex-column flex1 alignItems--center">
        <div className="flex-auto u-width--full">
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--tarawera">kurl</span>
          <span className="u-fontSize--header2 u-fontWeight--bold u-color--dustyGray">.sh</span>
        </div>
        <div className="u-flexTabletReflow flex-1-auto u-width--full">
          <div className="flex1 flex-column">
            <div className="left-content-wrap flex-column">
              <div className="u-marginTop--more u-fontSize--larger u-fontWeight--medium u-lineHeight--more u-color--tuna">
                  Kurl is a Kubernetes installer for airgapped and online clusters. 
                  This form allows you to quickly build an installer and will provide you with a URL that it can be installed at.
                </div>
                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Kubernetes version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Kubernetes are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center"> 
                      <div className="SelectApp--wrapper">
                        <Select
                          options={this.state.kubernetesVersions}
                          getOptionLabel={this.getLabel}
                          getOptionValue={(kubernetes) => kubernetes.verison}
                          value={this.state.selectedVersion}
                          onChange={this.onVersionChange}
                          matchProp="value"
                          isOptionSelected={() => false}
                        />
                      </div>
                    </div>  
                  </div>
                </div>

                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Weave version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Weave are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center"> 2</div>  
                  </div>
                </div>

                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Contour version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Contour are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center"> 2</div>  
                  </div>
                </div>

                <div className="flex u-marginTop--30">
                  <div className="flex flex1">
                    <div className="flex1"> 
                      <div className="FormLabel"> Rook version </div>
                      <div className="u-fontWeight--normal u-color--dustyGray u-lineHeight--normal u-marginBottom--more"> What version of Rook are you using? </div>
                    </div>  
                    <div className="flex1 u-paddingLeft--60 alignSelf--center"> 2</div>  
                  </div>
                </div>
              </div>
            </div>
          <div className="u-paddingLeft--60 flex-1-auto flex-column">
            <div className="MonacoEditor--wrapper helm-values flex1 flex u-height--full u-width--full u-marginTop--20">
                <div className="flex-column u-width--half u-overflow--hidden">
                  <MonacoEditor
                    ref={(editor) => { this.monacoEditor = editor }}
                    language="yaml"
                    onChange={this.onYamlChange}
                    value={this.state.kubernetesYaml}
                    height="100%"
                    width="100%"
                    options={{
                      readOnly: true,
                      minimap: {
                        enabled: false
                      }, 
                    scrollBeyondLastLine: false,
                    lineNumbers:"off"
                  }}
                  />
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Main);