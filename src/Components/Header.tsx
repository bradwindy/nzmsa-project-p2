import * as React from "react";
import logo from "./assets/logo.svg";

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
      <div className="container">
        <div className="col" />
        <div className="header p-0 m-0 mb-3 col-12">
          <nav className="navbar navbar-light pt-4 pb-0 pl-0 pr-0">
            <h2 id="logotext" className="float-left p-0 m-0">
              <img src={logo} width="30" height="30" alt="" />
              captiv
            </h2>
            <div className="col-6 float-right p-0">
              <div className="form-inline float-right">
                <input
                  className="form-control SearchBar border-light col float-right"
                  id="Search-Bar"
                  type="search"
                  placeholder="Add Video URL"
                  aria-label="Input Box for Video URL"
                  onChange={(event: any) =>
                    this.setState({ input: event.target.value })
                  }
                />
                <button
                  className="btn btn-outline-light float-right ml-2"
                  onClick={this.addVideo}
                  aria-label="Add video URL button"
                >
                  + Add
                </button>
              </div>
            </div>
          </nav>
        </div>
        <div className="col" />
      </div>
    );
  }
}
