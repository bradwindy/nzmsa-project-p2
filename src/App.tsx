import * as React from "react";
import ReactPlayer from "react-player";
import CaptionArea from "./Components/CaptionArea";
import Header from "./Components/Header";
import VideoList from "./Components/VideoList";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fasHeart,
  faPlus,
  faPlusCircle,
  faPlusSquare,
  faStar as fasStar,
  faTimes,
  faSearch,
  faFilm,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as farHeart,
  faStar as farStar,
} from "@fortawesome/free-regular-svg-icons";

library.add(
  fab,
  fasStar,
  farStar,
  fasHeart,
  farHeart,
  faPlusCircle,
  faPlus,
  faPlusSquare,
  faTimes,
  faSearch,
  faFilm,
  faClosedCaptioning,
  faMicrophone,
);

interface IState {
  channelID: any;
  playingUrl: any;
  updateVideoList: any;
}

class App extends React.Component<{}, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      channelID: "UC1LTUN0_l5s4MvjSkRhABJA",
      playingUrl: "https://www.youtube.com/watch?v=GlCmAC4MHek",
      updateVideoList: null,
    };
  }

  public addVideo = (url: any) => {
    const body = { url };
    fetch("https://captivapi.azurewebsites.net/api/Videos", {
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

  public updateURL = (url: string, channelID: string) => {
    if (this.state.playingUrl === url) {
      this.setState({ playingUrl: "" }, () =>
        this.setState({ playingUrl: url }),
      );
    } else {
      this.setState({ playingUrl: url });
    }

    this.setState({ channelID });
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
            <div className="col-lg-7 pt-3">
              {/*
              // @ts-ignore */}
              <ReactPlayer
                className="player"
                controls={true}
                url={this.state.playingUrl}
                width="100%"
                height="350px"
                aria-label="Video Player Window"
                playing={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                    preload: true,
                  },
                }}
              />

              <a
                href={
                  "http://www.youtube.com/channel/" +
                  this.state.channelID +
                  "?sub_confirmation=1"
                }
                className="btn btn-danger mt-3"
              >
                <FontAwesomeIcon icon={["fab", "youtube"]} />
                &nbsp;Subscribe
              </a>

              <a
                className="btn btn-primary mt-3 ml-2"
                href={
                  "https://www.facebook.com/sharer/sharer.php?u=" +
                  this.state.playingUrl
                }
              >
                <FontAwesomeIcon icon={["fab", "facebook"]} />
                &nbsp;Share
              </a>

              <a
                className="btn btn-info mt-3 ml-2"
                href={
                  "https://twitter.com/intent/tweet?text=" +
                  this.state.playingUrl
                }
              >
                <FontAwesomeIcon icon={["fab", "twitter"]} />
                &nbsp;Tweet
              </a>
            </div>
            <div className="col-lg-5 pt-3">
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
