import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showImage, setZoomLevel, setCurrentWidth, setClassification } from './fabricSlice';
import styles from './image.module.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class ControlPanelInternal extends Component {        

    constructor(props) {
        super();
        this.state = {currentWidth: props.currentWidth, currentClassification: "none"};
        this.loadImage = this.loadImage.bind(this);
        this.setZoomLevel = this.setZoomLevel.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.setClassificationType = this.setClassificationType.bind(this);
    }

    render() {
        if (!this.props.currentImage || this.props.currentImage === "") {
            // no object is on the canvas so show interface to add one
            return (<div style={{float: "right"}}>
                <button onClick={this.loadImage}>Add Picture</button>
            </div>);
        } else {
            let displayCatCount = null;
            if (this.props.currentData) { 
                let uniqueCategories = this.props.currentData.map(o => o.category).filter((value, index, self) => { 
                    return self.indexOf(value) === index;
                });
                displayCatCount = uniqueCategories.map(o => <p key={o}>{o}: {this.props.currentData.filter(item => item.category === o).length}</p>);
            }
            let captureState = this.state;
            // an object is selected so lets interact with it
            return (<div className={styles.controlPanel}>
                        <div className={styles.gridcontainer}>
                            <div className={this.props.currentZoom === 1 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(1) }>Top Left</div>
                            <div className={this.props.currentZoom === 2 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(2) }>Top Right</div>
                            <div className={this.props.currentZoom === 3 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(3) }>Bottom Left</div>
                            <div className={this.props.currentZoom === 4 ? styles.activeGridItem : styles.griditem} onClick={ () => this.setZoomLevel(4) }>Bottom Right</div>
                            <div className={this.props.currentZoom === 0 ? styles.activeGridFooter : styles.gridfooter} onClick={ () => this.setZoomLevel(0) }>See All</div>
                        </div>
                        <div>
                            <p>ClickWidth ({this.state.currentWidth})</p>
                            <Slider min={1} max={25} value={this.state.currentWidth} onChange={this.setWidth} 
                                onAfterChange={this.props.setWidth} />
                        </div>
                        <div>
                            <p>Classify clicked blocks as:</p>
                            <select name="select" onChange={this.setClassificationType} defaultValue={captureState.currentClassification}>
                                {
                                this.props.classifications.map(function(n) { 
                                    return (<option key={n.type} value={n.type}>{n.type + ": " + n.color}</option>);
                                })}
                            </select>
                        </div>
                    <p>Current data count:</p> {displayCatCount}
                </div>);
        } 
    }

    loadImage() {
        this.props.displayImage('https://joon-image-tag.s3.eu-west-1.amazonaws.com/GrassAndHouses.JPG');
    }

    setClassificationType(e) {
        this.setState({currentClassification: e.target.value});
        let typeName = e.target.value;        
        this.props.setClassificationType(this.props.classifications.find(o => o.type === typeName));
    }

    setWidth(width) {
        this.setState({currentWidth: width});
    }

    setZoomLevel(zoom) {
        this.props.setZoom(zoom);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {    
        classifications: state.fabric.classificationTypes,
        currentImage: state.fabric.displayImage,
        currentZoom: state.fabric.currentZoom,
        currentData: state.fabric.fabricData,
        currentWidth: state.fabric.currentWidth
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {    
        displayImage: function(imageUrl) { dispatch(showImage(imageUrl)) },
        setZoom: function(zoomLevel) { dispatch(setZoomLevel(zoomLevel)) },
        setWidth: function(newWidth) { dispatch(setCurrentWidth(newWidth))},
        setClassificationType: function(newClassification) { dispatch(setClassification(newClassification)) },
    }
}

const ControlPanel = connect(mapStateToProps, mapDispatchToProps)(ControlPanelInternal)
export default ControlPanel;