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
        let imgList = [""];
        imgList.push(this.props.availableImages);
        imgList = imgList.flat();

        return <div>
            <label>
                Queue Name: {this.props.queueName} 
            </label><br/>
            <label>
                Select Image to Classify:
                <select value={this.props.currentImage} onChange={this.handleChange}>
                    { imgList.map(name => <option key={name} value={name}>{name}</option>) }
                </select>
            </label>
        </div>
    }

    handleChange(event) {
        this.props.setSelectedImage(event.target.value);
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