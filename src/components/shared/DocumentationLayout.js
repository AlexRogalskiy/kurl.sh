import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';

import { BreakpointConfig } from "../../services/breakpoints";

import Sidebar from "../Sidebar";
import Navbar from "./NavBar";

export default class DocumentationLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    };
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  onResize = () => {
    const { isMobile } = this.state;
    const width = window.innerWidth;
    const { breakpoints } = BreakpointConfig;

    if (isMobile && width > breakpoints.desktopSmall) {
      this.setState({
        isMobile: false
      });
      return;
    }

    if (!isMobile && width < breakpoints.desktopSmall) {
      this.setState({
        isMobile: true
      });

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
            <Navbar isMobile={isMobile} />
            <div className="u-minHeight--full flex-column flex1">
              <div>
                <div className="Sidebar-wrapper">
                  <Sidebar
                    isMobile={isMobile}
                    slideOpen={true}
                  />
                </div>
              </div>
              <div className="flex-column flex1">
                {children}
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
