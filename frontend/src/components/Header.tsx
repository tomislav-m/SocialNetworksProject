import * as React from "react";
import { Navbar, Nav, NavDropdown, MenuItem, Glyphicon } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import GenreModal from 'src/containers/GenreModal';

interface IProps {
    firstName: string;
}

interface IState {
    logoutRedirect: boolean;
    profileRedirect: boolean;
    showGenreModal: boolean;
}
export default class Header extends React.Component<IProps, IState> {

    public componentWillMount() {
        this.setState({
            logoutRedirect: false,
            profileRedirect: false,
            showGenreModal: false
        });
    }
    public logout = () => {
        this.setState({
            logoutRedirect: true,
        });
    };

    public logoutRedirect() {
        if (this.state.logoutRedirect) {
            // gapi.auth2.getAuthInstance().disconnect();
            return <Redirect to="/"/>;
        }
        return null;
    }

    public openGenreModal = () => {
        this.setState({ showGenreModal: true })
    }

    public closeGenreModal = () => {
        this.setState({ showGenreModal: false })
    }

    public openProfile = () => {
        this.setState({
            profileRedirect: true
        })
    }

    public profileRedirect() {
        if (this.state.profileRedirect) {
            return <Redirect to="/profile" />;
        }
        return null;
    }

    public render() {
        const navDropdownTitle = <Glyphicon glyph="menu-hamburger" />;

        return (
            <div>
                {this.logoutRedirect()}
                {this.profileRedirect()}
                {this.state.showGenreModal && <GenreModal onClose={this.closeGenreModal} onSave={this.closeGenreModal}/>}
                <Navbar inverse>
                    <Navbar.Header >
                        <Navbar.Brand>
                            <a href="/movies" ><Glyphicon glyph="home" /> Movie SNApp</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight={true}>
                        <Navbar.Text>Hi, {this.props.firstName}!</Navbar.Text>
                        <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
                            <MenuItem onSelect={this.openProfile}>My Profile</MenuItem>
                            <MenuItem onSelect={this.openGenreModal}>Favourite genres</MenuItem>
                            <MenuItem divider />
                            <MenuItem onSelect={this.logout}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}
