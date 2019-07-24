import * as React from "react";

interface IState {
  input: string;
  result: any;
  body: any;
}

interface IProps {
  currentVideo: any;
  play: any;
}

export default class CaptionArea extends React.Component<IProps, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      body: [],
      input: "",
      result: [],
    };
  }

  public search = () => {
    if (this.state.input.trim() === "") {
      this.setState({ result: [] }, () => this.makeTableBody());
    } else {
      fetch(
        "https://scriberapi.azurewebsites.net/api/Videos/SearchByTranscriptions/" +
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
            <p>Sorry you need to search</p>
          </div>
        );
        this.setState({ body: error });
      } else {
        const error = (
          <div>
            <p>Sorry no results returned</p>
          </div>
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
            <h4 className="font-weight-bold">Search Captions:</h4>
          </div>
          <div className="col float-right">
            <div className="form-inline float-right">
              <input
                className="form-control mr-sm-2 SearchBar border-light"
                id="Search-Bar"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={this.state.input}
                onChange={(event: any) =>
                  this.setState({ input: event.target.value })
                }
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0 btn-outline-light"
                onClick={() => this.search()}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <br />
        <table className="table">
          <tr className="p-2 text-white">
            <th className="p-2">Time</th>
            <th className="p-2">Caption</th>
            <th className="p-2">Video</th>
          </tr>
          <tbody className="captionTable p-2">{this.state.body}</tbody>
        </table>
      </div>
    );
  }
}
