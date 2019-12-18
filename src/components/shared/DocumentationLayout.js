import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Resizer } from "./Resize";
import { BreakpointConfig } from "../../services/breakpoints";

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";
import { Helmet } from "react-helmet"

@Resizer(BreakpointConfig)
class DocumentationLayout extends Component {
  state = {
    isMobile: false
  }

  componentDidMount() {
    if (this.props.breakpoint) {
      this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.breakpoint !== lastProps.breakpoint && this.props.breakpoint) {
        this.setState({ isMobile: this.props.breakpoint === "mobile" })
    }
  }


  render() {
    const { children } = this.props;
    const { isMobile } = this.state;

    return (
      <StaticQuery
        query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
        render={data => (
          <>
            {!isMobile ?
              <div className="suite-banner">
                <div className="flex flex-row justifyContent--spaceBetween">
                  <div className="repl-logo-white"></div>
                  <div>
                    <a href="https://blog.replicated.com/kurl-with-replicated-kots/" target="_blank" rel="noopener noreferrer">Learn more about how kURL works with Replicated KOTS<span className="banner-arrow"></span></a>
                  </div>
                </div>
              </div>
              :
              <div className="mobile-suite-banner">
                <div className="flex flex-row justifyContent--spaceBetween">
                  <div className="flex flex1 alignItems--center">
                    <div className="repl-logo-white"></div>
                  </div>
                  <div className="u-marginLeft--normal">
                    <a href="https://blog.replicated.com/kurl-with-replicated-kots/" target="_blank" rel="noopener noreferrer">Learn more about how kURL works with Replicated KOTS<span className="banner-arrow"></span></a>
                  </div>
                </div>
              </div>
            }
            <Helmet>
              <meta charSet="utf-8" />
              <title>{children.props.children.props.children[0].props.children}</title>
            </Helmet>
            <Navbar isMobile={isMobile} title={`${children.props.children.props.children[0].props.children}`} />
            <div className={`u-minHeight--full u-width--full u-overflow--auto flex-column flex1 ${isMobile ? "" : "u-marginBottom---40"}`}>
              <div className={`${isMobile ? "Mobile--wrapper u-marginTop--120" : "Sidebar-wrapper"}`}>
                <Sidebar
                  isMobile={isMobile}
                  slideOpen={true}
                  pathname={this.props.location.pathname}
                />
              </div>
              <div className={`${isMobile ? "docs-mobile-container" : "docs-container"} flex-column flex1`}>
                {/* <div className="flex-column flex1 u-width--860">
                {children}
                </div> */}
                {!isMobile ?
                  <div className="flex-column flex1 u-width--860">
                    {children}
                  </div>
                  :
                  children
                }
              </div>
            </div>
          </>
        )}
      />
    );

  }
}

DocumentationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DocumentationLayout;
