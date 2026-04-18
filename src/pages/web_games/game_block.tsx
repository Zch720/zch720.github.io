import { useNavigate } from "react-router-dom";

function GameBlock(props: {
    name: string,
    image: string,
    path: string
}) {
    const { name, image, path } = props;
    const navigate = useNavigate();

    return (
        <div className={"game-list-block"} onClick={ () => navigate(path) }>
            <img src={image} />
            {name}
        </div>
    );
}

export default GameBlock;
