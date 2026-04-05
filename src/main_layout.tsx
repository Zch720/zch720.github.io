import { Divider } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import PageTab from "./components/page_tab";

function MainLayout() {
    return (
        <Fragment>
            <div style={{ "width": "100%", "display": "flex", "justifyContent": "center" }}>
                <PageTab
                    name={"首頁"}
                    routePage={"main"} />
                <PageTab
                    name={"專案"}
                    routePage={"projects"} />
                <PageTab
                    name={"網頁小遊戲"}
                    routePage={"web-games"} />
                <PageTab
                    name={"個人資訊"}
                    routePage={"info"} />
            </div>
            <Divider />
            <div style={{ "width": "70hw", "minWidth": "1344" }}>
                <Outlet />
            </div>
        </Fragment>
    );
}

export default MainLayout;