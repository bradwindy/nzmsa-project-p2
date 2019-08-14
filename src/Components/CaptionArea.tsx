import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

interface IState {
  input: string;
  result: any;
  body: any;
  listening: boolean;
}

interface IProps {
  currentVideo: any;
  play: any;
}

const { webkitSpeechRecognition } = window as any;
const { SpeechRecognition } = window as any;
const speechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new speechRecognition();

recognition.continous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

export default class CaptionArea extends React.Component<IProps, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      body: [],
      input: "",
      listening: false,
      result: [],
    };
    this.toggleListen = this.toggleListen.bind(this);
    this.handleListen = this.handleListen.bind(this);
  }

  public toggleListen() {
    this.setState(
      {
        listening: !this.state.listening,
      },
      this.handleListen,
    );
  }

  public handleListen() {
    if (this.state.listening) {
      recognition.start();
    }

    let finalTranscript = "";

    // prettier-ignore
    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }
      (document.getElementById("SearchCaption-Bar") as HTMLInputElement)!.value = interimTranscript;
      (document.getElementById("SearchCaption-Bar") as HTMLInputElement)!.value = finalTranscript;
      this.setState({ input: finalTranscript });
    };
  }

  public search = () => {
    if (this.state.input.trim() === "") {
      this.setState({ result: [] }, () => this.makeTableBody());
    } else {
      fetch(
        "https://captivapi.azurewebsites.net/api/Videos/SearchByTranscriptions/" +
          this.state.input,
        {
          headers: {
            Accept: "text/plain",
          },
          method: "GET",
        },
      )
        .then((response: any) => {
          return response.json();
        })
        .then((response: any) => {
          this.setState({ result: response }, () => this.makeTableBody());
        });
    }
  };

  public makeTableBody = () => {
    const toRet: any[] = [];
    this.state.result.sort((a: any, b: any) => {
      if (a.webUrl === b.webUrl) {
        return 0;
      } else if (a.webUrl === this.props.currentVideo) {
        return -1;
      } else if (b.webUrl === this.props.currentVideo) {
        return 1;
      } else {
        return a.videoTitle.localeCompare(b.videoTitle);
      }
    });
    this.state.result.forEach((video: any) => {
      video.transcription.forEach((caption: any) => {
        toRet.push(
          <tr
            className="p-2 text-white"
            onClick={() => this.handleClick(video.webUrl, caption.startTime)}
          >
            <td className="p-2">{caption.startTime}</td>
            <td className="p-2">{caption.phrase}</td>
            <td className="p-2">{video.videoTitle}</td>
          </tr>,
        );
      });
    });
    if (toRet.length === 0) {
      if (this.state.input.trim() === "") {
        const error = (
          <div>
            <p>Empty Search</p>
          </div>
        );
        this.setState({ body: error });
      } else {
        const error = (
          <tr>
            <td>
              <p color="white" className="p-2">
                Sorry, no results returned.
              </p>
            </td>
          </tr>
        );
        this.setState({ body: error });
      }
    } else {
      this.setState({ body: toRet });
    }
  };

  public handleClick = (url: any, time: any) => {
    window.scrollTo(0, 0);
    this.props.play(url + "&t=" + time + "s");
  };

  public render() {
    return (
      <div className="caption-area card mt-4 p-4 border-light mb-5">
        <div className="row">
          <div className="col">
            <h4 className="font-weight-bold">
              <FontAwesomeIcon
                icon={["fas", "closed-captioning"]}
                size="sm"
                style={{ color: "white" }}
              />{" "}
              captions
            </h4>
          </div>
          <div className="col-6 float-right p-0">
            <div className="form-inline float-right mr-2">
              <input
                className="form-control SearchBar border-light col"
                id="SearchCaption-Bar"
                type="search"
                placeholder="Enter Text"
                aria-label="Enter Text"
                value={this.state.input}
                onChange={(event: any) =>
                  this.setState({ input: event.target.value })
                }
              />
              <button
                className="btn my-2 my-sm-0 btn-outline-light ml-2"
                onClick={() => this.search()}
                aria-label="Search Captions"
              >
                Search
              </button>
              <button
                id="microphone-btn"
                className="btn btn-outline-light float-right ml-2"
                onClick={this.toggleListen}
                aria-label="Voice search"
              >
                <FontAwesomeIcon
                  icon="microphone"
                  size="sm"
                  style={{ color: "mediumturquoise" }}
                />{" "}
                Voice
              </button>
            </div>
          </div>
        </div>
        <br />
        <table className="table">
          <tbody>
            <tr className="p-2 text-white">
              <th className="p-2 font-weight-bold">Time</th>
              <th className="p-2 font-weight-bold">Caption</th>
              <th className="p-2 font-weight-bold">Video</th>
            </tr>
          </tbody>
          <tbody className="captionTable p-2">{this.state.body}</tbody>
        </table>
      </div>
    );
  }
}
