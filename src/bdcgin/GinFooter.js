import React, { Component } from "react";
import "./css/footer.css";

export default class GinFooter extends Component {
    render() {
        let gin = this.props.gin;
        let social_links = this.props.social_links;
        let support = this.props.support;

        return (
            <div className="footer">
                <span className="pull-left">
                    <a href={null} onClick={gin.newGame} title="Hard Reset For Developers">
                        New game
                    </a>
                </span>
                &nbsp;
                <a target="_blank" rel="noopener noreferrer" href={social_links.telegram}>
                    <img alt="" src="http://www.advanceduninstaller.com/7b12b396d38166a899fff585e466e50d-icon.ico" />
                    &nbsp; Telegram
                </a>
                &nbsp;&nbsp;&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={social_links.wiki}>
                    <img alt="" src="https://static.filehorse.com/icons-web/educational-software/wikipedia-icon-32.png" />
                    &nbsp; Wiki
                </a>
                &nbsp;&nbsp;&nbsp;
                <a target="_blank" rel="noopener noreferrer" href={social_links.reddit}>
                    <img alt="" src="https://images-na.ssl-images-amazon.com/images/I/418PuxYS63L.png" />
                    &nbsp; Reddit
                </a>
                &nbsp;&nbsp;&nbsp;
                <a rel="noopener noreferrer" href={support.show}>
                    <img alt="" src="https://image.flaticon.com/icons/svg/81/81924.svg" />
                    &nbsp; Support
                </a>
            </div>
        );
    }
}
