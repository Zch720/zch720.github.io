import { Grid } from "@mui/material";
import Games from "../../assets/games_data.json";
import GameBlock from "./game_block";

function WebGames() {
    return (
        <Grid container
            spacing={2}
            columns={{ xs: 3, sm: 4, md: 6 }}
        >
            {Games.games.map((game) => (
                <Grid size={1} key={game.path}>
                    <GameBlock name={game.name} image={game.image} path={game.path} />
                </Grid>
            ))}
        </Grid>
    );
}

export default WebGames;
