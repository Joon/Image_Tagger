import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSelectedImage, setSelectedQueue  } from './queueSlice';

class QueueControlInternal extends Component {    

    constructor(props){
        super(props);        
        this.state = {queueName: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return <div>
            <label>
                Queue Name:
                <input id="queuename" value={this.state.queueName} onChange={this.handleChange}></input>
            </label>
            <button onClick={() => this.props.setQueue(this.state.queueName)}>Set Q</button>
            <label>
                Select Image to Classify:
                <select value={this.props.currentImage}>
                    {this.props.availableImages ? this.props.availableImages.map(name => <option key={name} value={name}>{name}</option>) : null}
                </select>
            </label>
        </div>
    }

    handleChange(event) {
        this.setState({queueName: event.target.value});
    }
}

const mapStateToProps = (state, ownProps) => {
    return {    
        currentImage: state.queue.currentItem ? state.queue.currentItem.name : "",
        availableImages: state.queue.queueImages ? state.queue.queueImages.map(x => x.name) : [],
        queueName: state.queue.queueName
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setSelectedImage: (imageName) => {
            dispatch(setSelectedImage(imageName))
        },
        setQueue: (queueName) => {
            dispatch(setSelectedQueue(queueName))
        }
    }
}

const QueueControl = connect(mapStateToProps, mapDispatchToProps)(QueueControlInternal)
export default QueueControl;