import React from "react";
import Layout from "../components/Layout";
import Kurlsh from "../components/Kurlsh";
import { Resizer } from "../components/shared/Resize";
import { BreakpointConfig } from "../services/breakpoints";

@Resizer(BreakpointConfig)
class Kurl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      installerData: null
    };
  }
  
  fetchInstallerData = async () => {
    try {
      const resp = await fetch("https://kurl.sh/installer");  
      const installerData = await resp.json();
      this.setState({
        installerData
      });
    } catch (error) {
      throw error;
    }
  }
  
  componentDidMount() {
    if (!this.props.data) {
      this.fetchInstallerData();
    }
  }
  
  render() {
    const isMobile = this.props.breakpoint === "mobile";
    const { installerData } = this.state;
    // TODO: Replace "loading..." with a spinner or something else
    return (
      <Layout isMobile={isMobile}>
        { installerData 
          ? <Kurlsh isMobile={isMobile} installerData={installerData} />
          : "Loading..."
        }
      </Layout>
    )
  }
};

export default Kurl;