import * as React from "react";

interface IProps {
  addVideo: any;
}

interface IState {
  input: string;
}

export default class Header extends React.Component<IProps, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      input: "",
    };
  }

  public addVideo = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    this.props.addVideo(this.state.input);
  };

  public render() {
    return (
      <div className="header p-0 m-0 mb-3">
        <nav className="navbar navbar-light bg-light">
          <h4 className="navbar-brand p-0 m-0 font-weight-bold">Captiv</h4>
          <div className="form-inline">
            <input
              className="form-control mr-sm-2 SearchBar d-inline"
              id="Search-Bar"
              type="search"
              placeholder="Add Video URL"
              aria-label="Search"
              onChange={(event: any) =>
                this.setState({ input: event.target.value })
              }
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0 d-inline"
              onClick={this.addVideo}
            >
              Add
            </button>
          </div>
        </nav>
      </div>
    );
  }
}
