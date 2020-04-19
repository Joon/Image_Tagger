import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showImage, setZoomLevel } from './fabricSlice';
import styles from './image.module.css';

var fabric = window.fabric;

class NewObjectsInternal extends Component {        

    constructor() {
        super();
        this.loadImage = this.loadImage.bind(this);
        this.setZoomLevel = this.setZoomLevel.bind(this);
    }

    render() {
        if (!this.props.currentImage || this.props.currentImage === "") {
            // no object is on the canvas so show interface to add one
            return (<div style={{float: "right"}}>
                <button onClick={this.loadImage}>Add Picture</button>
            </div>);
        } else {
            // an object is selected so lets interact with it
            return (<div className={styles.gridcontainer}>
                    <div className={this.props.currentZoom === 1 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(1) }>Top Left</div>
                    <div className={this.props.currentZoom === 2 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(2) }>Top Right</div>
                    <div className={this.props.currentZoom === 3 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(3) }>Bottom Left</div>
                    <div className={this.props.currentZoom === 4 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(4) }>Bottom Right</div>
                    <div className={this.props.currentZoom === 0 ? styles.activeGridFooter : styles.gridfooter} onClick={ () => this.setZoomLevel(0) }>See All</div>
                </div>);
        } 
    }

    addCircle() {
        // all our action handler can just talk directly to fabric
        window.fabricCanvas.add(new fabric.Circle({
            radius: 50,
            originX: 'center',
            originY: 'center',
            fill: '#FFF',
            top: window.fabricCanvas.height / 2,
            left: window.fabricCanvas.width / 2,
        }));
        
        // when we are done makeing changes send the state from fabric
        window.fabricCanvas.fire('saveData');
    }

    addSquare() {
        window.fabricCanvas.add(new fabric.Rect({
            height: 100,
            width: 100,
            originX: 'center',
            originY: 'center',
            fill: '#FFF',
            top: window.fabricCanvas.height / 2,
            left: window.fabricCanvas.width / 2,
        }));
        window.fabricCanvas.fire('saveData');
    };

    loadImage() {
        this.props.displayImage('https://joon-image-tag.s3.eu-west-1.amazonaws.com/GrassAndHouses.JPG');
    }

    setZoomLevel(zoom) {
        this.props.setZoom(zoom);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {    
        currentImage: state.fabric.displayImage,
        currentZoom: state.fabric.currentZoom
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {    
        displayImage: function(imageUrl) { dispatch(showImage(imageUrl)) },
        setZoom: function(zoomLevel) { dispatch(setZoomLevel(zoomLevel)) },
    }
}

const NewObjects = connect(mapStateToProps, mapDispatchToProps)(NewObjectsInternal)
export default NewObjects;