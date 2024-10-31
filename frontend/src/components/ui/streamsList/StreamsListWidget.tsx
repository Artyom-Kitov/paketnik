import React, { useState } from "react";
import "./StreamsListWidget.css"

const StreamsListWidget = () => {
    const [streams, setStream] = useState([])

    return (
        <div className="streamsList">        
            <div className="title">Streams</div>
            <table className="table">
                <thead className="tableHead">
                    <tr>
                        <th>service</th>
                        <th>srcip</th>
                        <th>srcport</th>
                        <th>dstip</th>
                        <th>dstport</th>
                        <th>started_at</th>
                        <th>duration</th>
                        <th>up</th>
                        <th>down</th>
                    </tr>
                </thead>
            </table>
            <div className="streamsContainer"> 
                {
                    streams.map((stream) => <div></div>)
                }
            </div>
        </div>
    );
}

export default StreamsListWidget