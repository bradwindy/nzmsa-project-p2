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
          <tr onClick={() => this.handleClick(video.webUrl, caption.startTime)}>
            <td>{caption.startTime}</td>
            <td>{caption.phrase}</td>
            <td>{video.videoTitle}</td>
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
      <div className="caption-area card mt-4 p-4">
        <div className="row">
          <div className="col">
            <h4 className="font-weight-bold">Search Captions:</h4>
          </div>
          <div className="col float-right">
            <div className="form-inline float-right">
              <input
                className="form-control mr-sm-2 SearchBar d-inline"
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
                className="btn btn-outline-success my-2 my-sm-0 d-inline"
                onClick={() => this.search()}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <br />
        <table className="table">
          <tr>
            <th>Time</th>
            <th>Caption</th>
            <th>Video</th>
          </tr>
          <tbody className="captionTable">{this.state.body}</tbody>
        </table>
      </div>
    );
  }
}
