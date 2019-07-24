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
          <nav className="navbar navbar-light pt-5 pb-3 pl-0 pr-0">
            <h2 id="logotext" className="float-left p-0 m-0">
              <img src={logo} width="30" height="30" alt="" />
              captiv
            </h2>
            <div className="form-inline">
              <input
                className="form-control mr-sm-2 SearchBar border-light"
                id="Search-Bar"
                type="search"
                placeholder="Add Video URL"
                aria-label="Search"
                onChange={(event: any) =>
                  this.setState({ input: event.target.value })
                }
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0 btn-outline-light"
                onClick={this.addVideo}
              >
                Add
              </button>
            </div>
          </nav>
        </div>
        <div className="col" />
      </div>
    );
  }
}
