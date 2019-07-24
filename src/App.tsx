import * as React from "react";
import ReactPlayer from "react-player";
import CaptionArea from "./Components/CaptionArea";
import Header from "./Components/Header";
import VideoList from "./Components/VideoList";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHeart as fasHeart,
  faPlus,
  faPlusCircle,
  faPlusSquare,
  faStar as fasStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as farHeart,
  faStar as farStar,
} from "@fortawesome/free-regular-svg-icons";

library.add(
  fasStar,
  farStar,
  fasHeart,
  farHeart,
  faPlusCircle,
  faPlus,
  faPlusSquare,
  faTimes,
);

interface IState {
  playingUrl: any;
  updateVideoList: any;
}

class App extends React.Component<{}, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      playingUrl: "",
      updateVideoList: null,
    };
  }

  public addVideo = (url: any) => {
    const body = { url };
    fetch("https://scriberapi.azurewebsites.net/api/Videos", {
      body: JSON.stringify(body),
      headers: {
        "Accept": "text/plain",
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(() => {
      this.state.updateVideoList();
    });
  };

  public updateURL = (url: string) => {
    if (this.state.playingUrl === url) {
      this.setState({ playingUrl: "" }, () =>
        this.setState({ playingUrl: url }),
      );
    } else {
      this.setState({ playingUrl: url });
    }
  };

  public videoList = (callback: any) => {
    this.setState({ updateVideoList: callback });
  };

  public render() {
    // @ts-ignore
    return (
      <div>
        <Header addVideo={this.addVideo} />
        <div className="container">
          <div className="row">
            <div className="col-7">
              {/*
              // @ts-ignore */}
              <ReactPlayer
                className="player"
                controls={true}
                url={this.state.playingUrl}
                width="100%"
                height="400px"
                playing={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                    preload: true,
                  },
                }}
              />
            </div>
            <div className="col-5">
              <VideoList play={this.updateURL} mount={this.videoList} />
            </div>
          </div>
          <CaptionArea
            play={this.updateURL}
            currentVideo={this.state.playingUrl}
          />
        </div>
      </div>
    );
  }
}

export default App;
