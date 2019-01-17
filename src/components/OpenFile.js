import React from "react";

const { dialog } = window.require("electron").remote;

import {
  openAlert, 
  closeAlert
} from "../utils/utils.js";

import Alert from "./partials/Alert";
import ExitModal from "./partials/ExitModal";
import { closeApp } from "../utils/utils.js";

export default class OpenFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //wallet state settings
      wallet_loaded: false,
      wallet_path: "",
      
    };

    this.goToPage = this.goToPage.bind(this);
    this.browseFile = this.browseFile.bind(this);
    this.openFile = this.openFile.bind(this);
    this.openAnotherFile = this.openAnotherFile.bind(this);
    this.toggleExitModal = this.toggleExitModal.bind(this);
    this.setCloseApp = this.setCloseApp.bind(this);
    this.setOpenAlert = this.setOpenAlert.bind(this);
    this.setCloseAlert = this.setCloseAlert.bind(this);
  }

  goToPage() {
    this.props.goToPage();
  }

  toggleExitModal() {
    this.setState({
      exit_modal: !this.state.exit_modal
    });
  }

  setCloseApp() {
    closeApp(this);
  }

  setOpenAlert(alert, alert_state, disabled) {
    openAlert(this, alert, alert_state, disabled);
  }

  setCloseAlert() {
    closeAlert(this);
  }

  openAnotherFile() {
    this.setState({ wallet_loaded: false });
  }

  browseFile() {
    var filename = "";
    filename = dialog.showOpenDialog({});
    console.log("filename " + filename);

    this.setState(() => ({
      wallet_path: filename
    }));
  }

  openFile(e) {
    e.preventDefault();
    const pass = e.target.pass.value;
    let filename = e.target.filepath.value;

    if (filename === "") {
      this.setOpenAlert("Choose the wallet file", "alert", false);
      return false;
    }
    if (pass === "") {
      this.setOpenAlert(
        "Enter password for your wallet file",
        "alert",
        false
      );
      return false;
    }
    this.setState({
      alert_close_disabled: true
    });
    this.setOpenAlert(
      "Please wait while your wallet file is loaded",
      "alert",
      true
    );
    this.props.createWallet("openWallet", {
      path: this.state.wallet_path,
      password: pass,
      network: "mainnet",
      daemonAddress: "rpc.safex.io:17402",
    });
  }

  render() {
    return (
      <div
        className={
          this.state.closing
            ? "create-new-wrap open-file-wrap animated fadeOut"
            : "create-new-wrap open-file-wrap"
        }
      >
        <img
          src="images/open-wallet-file.png"
          className="create-new-pic"
          alt="open-wallet-file"
        />
        <button onClick={this.goToPage} className="go-back-btn button-shine">
          Back
        </button>
        <button
          onClick={this.toggleExitModal}
          className="close-app-btn button-shine"
          title="Exit"
          disabled={this.state.alert_close_disabled ? "disabled" : ""}
        >
          X
        </button>
        <h2 className={this.state.wallet_loaded ? "hidden" : ""}>
          Open Wallet File
        </h2>

        <div
          className={
            this.state.wallet_loaded
              ? "hidden"
              : "col-xs-6 col-xs-push-3 login-wrap"
          }
        >
          <button
            className={
              this.state.wallet_loaded ? "hidden" : "browse-btn button-shine"
            }
            onClick={this.browseFile}
          >
            Browse
          </button>
          <form
            onSubmit={this.openFile}
            className={this.state.wallet_loaded ? "hidden" : ""}
          >
            <div className="group-wrap">
              <div className="form-group">
                <input
                  name="filepath"
                  value={this.state.wallet_path}
                  placeholder="wallet file path"
                  readOnly
                />
                <input type="password" name="pass" placeholder="password" />
              </div>
            </div>
            <button type="submit" className="submit btn button-shine">
              Open
            </button>
          </form>

          <Alert
            openAlert={this.state.alert}
            alertText={this.state.alert_text}
            alertCloseDisabled={this.state.alert_close_disabled}
            closeAlert={this.setCloseAlert}
          />
        </div>

        <ExitModal
          exitModal={this.state.exit_modal}
          closeExitModal={this.toggleExitModal}
          closeApp={this.setCloseApp}
        />
      </div>
    );
  }
}
