import React, { Component } from "react";
import numeral from "numeral";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Translate} from 'react-redux-i18n';
import axios from "../../axios";

import { connect } from "react-redux";

class HostMenu extends Component {

  hostsService = axios(
    "internal.php?object=centreon_topcounter&action=hosts_status"
  );

  refreshInterval = null;

  state = {
    toggled: false,
    data: null,
    intervalApplied: false
  };

  UNSAFE_componentWillMount() {
    window.addEventListener('mousedown', this.handleClick, false);
  };

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick, false);
    clearInterval(this.refreshInterval);
  };

  // fetch api to get host data
  getData = () => {
    this.hostsService.get().then(({data}) => {
      this.setState({
        data
      });
    }).catch((error) => {
      if (error.response.status == 401){
        this.setState({
          data: null
        });
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const {refreshTime} = nextProps;
    const {intervalApplied} = this.state;
    if(refreshTime && !intervalApplied){
      this.getData();
      this.refreshInterval = setInterval(() => {
        this.getData();
      }, refreshTime);
      this.setState({
        intervalApplied:true
      })
    }
  }

  // display/hide detailed host data
  toggle = () => {
    const { toggled } = this.state;
    this.setState({
      toggled: !toggled
    });
  };

  // hide host detailed data if click outside
  handleClick = (e) => {
    if (!this.host || this.host.contains(e.target)) {
      return;
    }
    this.setState({
      toggled: false
    });
  };

  render() {
    const { data, toggled } = this.state;

    // do not display host information until having data
    if (!data) {
      return null
    }

    return (
      <div class={"wrap-right-hosts" + (toggled ? " submenu-active" : "")}>
        <Link to={"/main.php?p=20202&o=h_down&search="} class={"wrap-middle-icon round round-small "+ (data.down.unhandled > 0 ? "red" : "red-bordered")}>
          <span class="number">
            <span id="count-host-down">{numeral(data.down.unhandled).format("0a")}</span>
          </span>
        </Link>
        <Link to={"/main.php?p=20202&o=h_unreachable&search="} class={"wrap-middle-icon round round-small "+ (data.unreachable.unhandled > 0 ? "gray-dark" : "gray-dark-bordered")}>
          <span class="number">
            <span id="count-host-unreachable">{numeral(data.unreachable.unhandled).format("0a")}</span>
          </span>
        </Link>
        <Link to={"/main.php?p=20202&o=h_up&search="} class={"wrap-middle-icon round round-small "+ (data.ok > 0 ? "green" : "green-bordered")}>
          <span class="number">
            <span id="count-host-up">{numeral(data.ok).format("0a")}</span>
          </span>
        </Link>
        <div ref={host => this.host = host}>
          <span class="wrap-right-icon hosts" onClick={this.toggle.bind(this)}>
            <span class="iconmoon icon-hosts">
              {data.pending > 0 ? <span class="custom-icon" /> : null}
            </span>
            <span class="wrap-right-icon__name"><Translate value="Hosts"/></span>
          </span>
          <span class="toggle-submenu-arrow" onClick={this.toggle.bind(this)} >{this.props.children}</span>
          <div class="submenu host">
            <div class="submenu-inner">
              <ul class="submenu-items list-unstyled">
                <li class="submenu-item">
                  <Link
                    to={"/main.php?p=20202&o=h&search="}
                    class="submenu-item-link"
                  >
                    <div onClick={this.toggle}>
                      <Translate value="All"/>
                      <span class="submenu-count">{numeral(data.total).format("0a")}</span>
                    </div>
                  </Link>
                </li>
                <li class="submenu-item">
                  <Link
                    to={"/main.php?p=20202&o=h_down&search="}
                    class="submenu-item-link"
                  >
                    <div onClick={this.toggle}>
                      <span class="dot-colored red"><Translate value="Down"/></span>
                      <span class="submenu-count">
                        {numeral(data.down.unhandled).format("0a")}/{numeral(data.down.total).format("0a")}
                      </span>
                    </div>
                  </Link>
                </li>
                <li class="submenu-item">
                  <Link
                    to={"/main.php?p=20202&o=h_unreachable&search="}
                    class="submenu-item-link"
                  >
                    <div onClick={this.toggle}>
                      <span class="dot-colored gray"><Translate value="Unreachable"/></span>
                      <span class="submenu-count">
                        {numeral(data.unreachable.unhandled).format("0a")}/{numeral(data.unreachable.total).format("0a")}
                      </span>
                    </div>
                  </Link>
                </li>
                <li class="submenu-item">
                  <Link
                    to={"/main.php?p=20202&o=h_up&search="}
                    class="submenu-item-link"
                  >
                    <div onClick={this.toggle}>
                      <span class="dot-colored green"><Translate value="Up"/></span>
                      <span class="submenu-count">{numeral(data.ok).format("0a")}</span>
                    </div>
                  </Link>
                </li>
                <li class="submenu-item">
                  <Link
                    to={"/main.php?p=20202&o=h_pending&search="}
                    class="submenu-item-link"
                  >
                    <div onClick={this.toggle}>
                      <span class="dot-colored blue"><Translate value="Pending"/></span>
                      <span class="submenu-count">{numeral(data.pending).format("0a")}</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ intervals }) => ({
  refreshTime: intervals ? parseInt(intervals.AjaxTimeReloadMonitoring)*1000 : false
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HostMenu);

HostMenu.propTypes = {
  children: PropTypes.element.isRequired,
};
