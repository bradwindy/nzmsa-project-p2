import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IState {
  videoList: any;
}

interface IProps {
  play: any;
  mount: any;
}

export default class VideoList extends React.Component<IProps, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      videoList: [],
    };
    this.updateList();
  }

  public componentDidMount = () => {
    this.props.mount(this.updateList);
  };

  public updateList = () => {
    fetch("https://captivapi.azurewebsites.net/api/Videos", {
      method: "GET",
    })
      .then((response: any) => {
        return response.json();
      })
      .then((response: any) => {
        const output: any[] = [];
        response.forEach((video: any) => {
          // TODO change <star> to a font-awesome icon.
          const row = (
            <tr key={video.videoId} aria-label={video.videoTitle}>
              <td
                className="align-middle pl-3 pr-2"
                onClick={() => this.handleLike(video)}
                aria-label="Heart Button"
              >
                {video.isFavourite === true ? (
                  <FontAwesomeIcon
                    icon={["fas", "heart"]}
                    size="lg"
                    style={{ color: "hotpink" }}
                    aria-label="Unheart video"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={["far", "heart"]}
                    size="lg"
                    style={{ color: "hotpink" }}
                    aria-label="Heart video"
                  />
                )}
              </td>
              <td
                className="align-middle p-2"
                onClick={() => this.props.play(video.webUrl)}
                aria-label={"Video thumbnail for " + video.videoTitle}
              >
                <img
                  alt={"Video thumbnail for " + video.videoTitle}
                  src={video.thumbnailUrl}
                  width="100px"
                />
              </td>
              <td
                className="align-middle p-2 text-white"
                onClick={() => this.props.play(video.webUrl)}
              >
                {video.videoTitle}
              </td>
              <td
                className="align-middle p-3"
                onClick={() => this.deleteVideo(video.videoId)}
                aria-label="Remove Video from List"
              >
                <FontAwesomeIcon
                  icon="times"
                  size="lg"
                  style={{ color: "white" }}
                  aria-label="Remove Video from List"
                />
              </td>
            </tr>
          );
          if (video.isFavourite) {
            output.unshift(row);
          } else {
            output.push(row);
          }
        });
        this.setState({ videoList: output });
      });
  };

  public deleteVideo = (id: any) => {
    fetch("https://captivapi.azurewebsites.net/api/Videos/" + id, {
      method: "DELETE",
    }).then(() => {
      this.updateList();
    });
  };

  public handleLike = (video: any) => {
    const toSend = [
      {
        from: "",
        op: "replace",
        path: "/isFavourite",
        value: !video.isFavourite,
      },
    ];
    fetch(
      "https://captivapi.azurewebsites.net/api/Videos/update/" + video.videoId,
      {
        body: JSON.stringify(toSend),
        headers: {
          "Accept": "text/plain",
          "Content-Type": "application/json-patch+json",
        },
        method: "PATCH",
      },
    ).then(() => {
      this.updateList();
    });
  };

  public render() {
    return (
      <div className="video-list card border-light" aria-label="Video List">
        <h4 className="pt-3 pl-3 pb-2">
          <FontAwesomeIcon icon="film" size="sm" style={{ color: "white" }} />{" "}
          videos
        </h4>
        <table className="table">
          <tbody>{this.state.videoList}</tbody>
        </table>
      </div>
    );
  }
}
