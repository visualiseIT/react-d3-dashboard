import React, { Component } from 'react';
import BarChart from '../../charts/BarChart';
import ForceChart from '../../charts/ForceChart';
import './view7.css';

export default class view7 extends Component {
    render() {
        const {data, d3data} = this.props;
        return (
            <div id='view7' className='pane'>
                <div className='header'>Age</div>
                <div className='news-visualiser' style={{ overflowX: 'scroll',overflowY:'hidden' }}>
                    {/*<BarChart data={data} width={1000} height={550}/>*/}
                    <ForceChart data={data} d3data={d3data} width={1000} height={550}/>
                </div>
            </div>
        )
    }
}