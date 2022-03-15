import React, { Component } from "react";
import Header from "../header";
import SmartStorage from "../../model/SmartStorage";
import SmartSorting from "../../model/SmartSorting";
import SmartDistribution from "../../model/SmartDistribution";
import SmartDevices from "../../model/SmartDevices";
import Map from "../../pages/Map";
import { Common } from "../../pages/Map/map3d";
import "./style.scss";

export default class Homer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choiceIndex: 1,
      nodesentence: false,
      nodeTxt: "",
      toplist: [
        { name: "智慧调度", url: "shouye.png" },
        { name: "智慧园区", url: "yuanqu.png" },
        { name: "智慧安防", url: "anfang.png" },
        { name: "智慧设备", url: "gongshangcaishui.png" },
        { name: "智慧仓储", url: "tubiaozhizuomoban.png" },
        { name: "智慧分拣", url: "fenjian.png" },
        { name: "智慧配送", url: "tubiaozhizuomoban.png" },
        { name: "智慧评价", url: "fenjian.png" },
      ],

      urltxt: [
        { id: 0, txt: "/SmartDevices" },
        { id: 1, txt: "/SmartDispatch" },
        { id: 2, txt: "/SmartDistribution" },
        { id: 3, txt: "/SmartEvaluate" },
        { id: 4, txt: "/SmartStorage" },
        { id: 5, txt: "/SmartSorting" },
        { id: 6, txt: "/SmartDistribution" },
        { id: 7, txt: "/SmartPark" },
      ],
      cameralist: [],
    };
  }

  ContentHome(key) {
    switch (key) {
      case 0:
        Common.ZTDHInit();
        // ContentHome={(key)=>this.SwitchPages(key)}
        return <SmartDevices />;
      case 1:
        //Common.ZTDHInit()
        return;
      case 2:
        return;
      case 3:
        return;
      case 4:
        return <SmartStorage />;
      case 5:
        return <SmartSorting />;
      case 6:
        return <SmartDistribution />;
      case 7:
        return;
      default:
        return;
    }
  }

  SwitchPages(key) {
    let R = true,
      txt = "",
      list = [];
    if (key === 1) {
      txt = "周界";
      list = [
        { name: "周界监控", code: "c8cee1531f2440bfbca6456c30a456a3" },
        { name: "异常行为监控", code: "e9573828ba4d4cbab483c3f340185fe9" }
      ];
    } else if (key === 2) {
      txt = "园区";
      list = [
        { name: "人脸识别", code: "3f38ae1d3720488b9b131fa22f59ade4" },
        { name: "车辆识别", code: "1264282a69d94be18d461456536d4ea1" },
        { name: "园区全景", code: "026a197ba8094ffb8396a4088e9514db" },
      ];
      Common.getlocation();
    }
    else {
      R = false;
    }

    this.setState({
      choiceIndex: key,
      nodesentence: R,
      nodeTxt: txt,
      cameralist: list,
    });
  }

  //   SwitchNodeRead(isRead) {
  //     this.setState({
  //         Nodelist:isRead
  //     });
  //   }

  componentDidMount() {
    const { urltxt } = this.state,
      _this = this;
    urltxt.forEach((element) => {
      if (this.props.location.pathname === element.txt) {
        _this.setState({
          choiceIndex: element.id,
        });
      }
    });
    console.log("pathname:" + this.props.location.pathname);
    //console.log("id:"+this.props.match.params.id)
  }
  SetvideoData(code) {
    Common.Getsend(code);
  }

  render() {
    const { choiceIndex, toplist, nodesentence, cameralist, nodeTxt } = this.state;
    return (
      <div className="homeconent">
        <Header
          PagesSet={(key) => this.SwitchPages(key)}
          toplist={toplist}
          choiceIndex={choiceIndex}
        />
        <div
          className="conent"
          style={
            nodesentence
              ? { pointerEvents: "visible",height:"auto" }
              :choiceIndex===6?{ pointerEvents: "visible",height:"100%" }: { pointerEvents: "none",height:"100%" }
          }
        >
          {this.ContentHome(choiceIndex)}
          {nodesentence ? (
            <ul className="ceamraNodelist">
              <li>{nodeTxt}监控节点列表</li>
              {cameralist.map((item) => (
                <li
                  className="cameralist"
                  onClick={() => this.SetvideoData(item.code)}
                  key={item.code}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
        <Map />
      </div>
    );
  }
}
