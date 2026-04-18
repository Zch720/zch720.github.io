import { NavLink } from "react-router-dom";

function PageTab(props: {
    name: string,
    routePage: string
}) {
    const { name, routePage } = props;

    return (
        <div style={{ "margin": "1rem" }}>
            <NavLink
                to={routePage}
                className={({ isActive }) => { return isActive ? "nav-tag activate-nav-tag" : "nav-tag"; }}
            >
                {name}
            </NavLink>
        </div>
    );
}

export default PageTab;