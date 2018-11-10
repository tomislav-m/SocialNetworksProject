import * as React from "react";
import { Navbar, Nav, NavDropdown, MenuItem, Glyphicon } from "react-bootstrap";
import { Redirect } from "react-router-dom";

interface IState {
    redirect: boolean;
}

export default class Header extends React.Component<{}, IState> {

    public componentWillMount() {
        this.setState({ redirect: false });
    } 
    public setRedirect = () => {
        this.setState({ redirect: true });
    };

    public renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to="/" />;
        }
        return null;
    }

    public render() {
        const navDropdownTitle = <Glyphicon glyph="menu-hamburger" />;

        return (
            <div>
                {this.renderRedirect()}
                <Navbar inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                        <a href="/movies">Ime aplikacije</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight={true}>
                        <Navbar.Text>Hi, user!</Navbar.Text>
                            <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
                                <MenuItem>My Profile</MenuItem>
                                <MenuItem>Select genres</MenuItem>
                                <MenuItem divider />
                                <MenuItem onSelect={this.setRedirect}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}
