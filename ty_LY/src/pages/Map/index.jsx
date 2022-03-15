import React, { Component, Fragment } from "react";
import { Common } from "./map3d";
//import axios from "axios";
//import { getfaceinfo } from "../../api/mainApi";
import "./style.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facedata: [],
      Imgurl: "",
      ImgesRd: false,
      faceminRd: false,
    };
  }
  componentDidMount() {
    //var this_;
    Common.openClick();
    Common.btn2Click();
    Common.ZTDHInit();
    // Common.SetResolution()
    //this.requestFullScreen();
    //屏蔽浏览器右键
    document.oncontextmenu = function (e) {
      /*屏蔽浏览器默认右键事件*/
      e = e || window.event;
      return false;
    };
    window.onkeydown = function (event) {
      console.log(event);
      setTimeout(function () {
        Common.SetResolution("mapvision3d");
      }, 1000);
    };
    //this_ = this;
    window.addEventListener("message", (e) => {
      return
      // axios
      //   .get(getfaceinfo(), {
      //     params: { code: e.data.gid.split("_")[0] },
      //   })
      //   .then(function (res) {
      //     if (res.data.msg === "200") {
      //       this_.setState({
      //         facedata: res.data.data,
      //         faceminRd: true,
      //       });
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    });
  }
  SetImges(url) {
    console.log(url, "URlxx");

    this.setState({
      Imgurl: url,
      ImgesRd: true,
    });
  }
  CloseImges(Rd) {
    if (Rd > 0) {
      this.setState({
        ImgesRd: false,
      });
    } else {
      this.setState({
        ImgesRd: false,
        faceminRd: false,
      });
    }
  }
  render() {
    const { facedata, Imgurl, ImgesRd, faceminRd } = this.state;
    return (
      <Fragment>
        <div id="mapvision3d"></div>
        {faceminRd ? (
          <div className="facemin">
            <span className="faceminclose" onClick={() => this.CloseImges(0)}>
              X
            </span>
            <ul className="CompletedSmart-Tab" style={{ fontSize: "13px " }}>
              <li className="Tab-Th">
                <span>全景照</span>
                <span>人脸照</span>
                <span>时间</span>
              </li>
              {facedata.length > 0
                ? facedata.map((item, key) => (
                    <li key={key}>
                      <span
                        className="Cljbj"
                        onClick={() => this.SetImges(item.url)}
                      >
                        查看
                      </span>
                      <span
                        className="Cljbj"
                        onClick={() => this.SetImges(item.name)}
                      >
                        查看
                      </span>
                      <span>{item.sendtime}</span>
                    </li>
                  ))
                : ""}
            </ul>
          </div>
        ) : (
          ""
        )}
        {ImgesRd ? (
          <div className="mmglj">
            <span onClick={() => this.CloseImges(1)}>X</span>
            <img alt="" src={Imgurl} />
          </div>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}
