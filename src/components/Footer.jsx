import React from "react";
import { Link, withRouter } from "react-router-dom";
import "../scss/components/Footer.scss";

export class Footer extends React.Component {

  getItems() {
    return [
      {
        label: "Terms",
        linkTo: "/terms",
      },
      {
        label: "Privacy",
        linkTo: "/privacy",
      },
    ];
  }

  render() {
    const footerItems = this.getItems();
    return (
      <div className={`FooterContent-wrapper flex flex-auto justifyContent--center ${this.props.className || ""}`}>
        <div className="Footer-container flex1 flex">
          <div className="flex flex-auto">
            <div className="FooterItem-wrapper">
              <span className="FooterItem">&#169; {new Date().getFullYear()}, Replicated, Inc. All Rights Reserved.</span>
            </div>
          </div>
          <div className="flex flex1 justifyContent--flexEnd">
            {footerItems.filter(item => item).map((item, i) => {
              let node = (
                <span className="FooterItem">{item.label}</span>
              );
              if (item.linkTo) {
                node = (
                  <Link to={item.linkTo} target="_blank" rel="noopener noreferrer" className="FooterItem">{item.label}</Link>
                );
              } else if (item.href) {
                node = (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="FooterItem">{item.label}</a>
                );
              }
              return (
                <div key={i} className="FooterItem-wrapper">
                  {node}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Footer);
