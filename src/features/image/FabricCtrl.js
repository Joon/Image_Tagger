import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFabricData, setActiveObject } from './fabricSlice';

var fabric = window.fabric;

class FabricControlInternal extends Component {    

    constructor(props){
        super(props);
        this.el = React.createRef();
    }

    componentDidMount() {
        window.fabricCanvas = new fabric.Canvas();
        
        // Here we have the canvas so we can initialize fabric
        window.fabricCanvas.initialize(this.el.current, {
            height: 768,
            width: 1024,
            renderOnAddRemove: false,
            selection: false
        });

        window.fabricCanvas.on('mouse:down', (options)=> {            
            if (options.target == null)
                return;
            window.currentlyHighlighting = true;
            options.target.set('fill', window.currentClickColor);
            options.target.set('category', window.currentClickCategory);
            window.fabricCanvas.requestRenderAll();
        });

        window.fabricCanvas.on('mouse:over', (options)=> {
            if (options.target == null)
                return;
            console.log(options.target.get('gridX') + ": " + options.target.get('gridY'));
            if (window.currentlyHighlighting) {      
                options.target.set('fill', window.currentClickColor);
                options.target.set('category', window.currentClickCategory);                
            }
        });

        // on mouse up lets save some state
        window.fabricCanvas.on('mouse:up', () => {
            window.currentlyHighlighting = false;
            window.fabricCanvas.requestRenderAll();
        });
    
        // an event we will fire when we want to save state
        window.fabricCanvas.on('saveData', () => {
            
        });
    }
        
    render() {
        let captureImage = this.props.currentImage;
        if (window.fabricCanvas) {
            var renderImage = true;
            var objects = window.fabricCanvas.getObjects();
            if (objects.length > 0) {
                var currentImage = objects[0].get('renderedImage');
                if (currentImage === this.props.currentImage)
                    renderImage = false;
            }
            
            if (renderImage) {
                fabric.Image.fromURL(this.props.currentImage, function(myImg) {
                    window.fabricCanvas.clear();
                    //i create an extra var for to change some image properties
                    var img1 = myImg.set({ left: 0, top: 0});                    
                    img1.setControlsVisibility({
                        mt: false, 
                        mb: false, 
                        ml: false, 
                        mr: false, 
                        bl: false,
                        br: false, 
                        tl: false, 
                        tr: false,
                        mtr: false, 
                    });
                    img1.lockMovementY = true;
                    img1.lockMovementX = true;
                    img1.selectable = false;
                    var gridWidth = img1.width;
                    var gridHeight = img1.height;
        
                    window.fabricCanvas.add(img1);
        
                    var gridSize = 20; // define grid size
        
                    for(var x = Math.ceil(gridWidth/gridSize); x--;){
                        for(var y = Math.ceil(gridHeight/gridSize); y--;){
                            // create a rectangle object
                            var rect = new fabric.Rect({
                                left: (x * gridSize),
                                top: (y * gridSize),
                                width: gridSize,
                                height: gridSize,
                                strokeWidth: 1,
                                stroke:'black',                                
                                fill:'grey',
                                opacity: 0.5,
                                lockMovementY: true,
                                lockMovementX: true,
                                hoverCursor: 'crosshair',
                                objectCaching: false,
                                selectable: false
                            });
                            rect.set('category', 'none');
                            rect.set('gridX', x);
                            rect.set('gridY', y);
                            rect.setControlsVisibility({
                                mt: false, mb: false, ml: false, mr: false, 
                                bl: false, br: false, tl: false, tr: false,
                                mtr: false, 
                            });
                            window.fabricCanvas.add(rect);
                        }
                    }
                    window.fabricCanvas.getObjects()[0].set('renderedImage', captureImage);
                    window.fabricCanvas.renderAll();
                    // Group add to canvas
                    //window.fabricCanvas.add(oGridGroup);                
                    window.fabricCanvas.setZoom(0.22);  
                    window.fabricCanvas.fire('saveData');        
                });
            }

            if (this.props.currentZoom !== 0) {
                window.fabricCanvas.setZoom(0.44);  
                if (this.props.currentZoom === 1) {
                    window.canvasOrigin = { x: 0, y: 0 };
                }
                if (this.props.currentZoom === 2) {
                    window.canvasOrigin = { x: objects[0].width / 4.5, y: 0 };
                }
                if (this.props.currentZoom === 3) {
                    window.canvasOrigin = { x: 0, y: objects[0].height / 4.5 };
                }
                if (this.props.currentZoom === 4) {
                    window.canvasOrigin = { x: objects[0].width / 4.5, y: objects[0].height / 4.5 };
                }                              
            } else {
                window.fabricCanvas.setZoom(0.22);
                window.canvasOrigin = { x: 0, y: 0 };
            }
            window.fabricCanvas.absolutePan(window.canvasOrigin);
            window.fabricCanvas.renderAll();
            window.currentClickColor = 'pink';
            window.currentClickCategory = 'whatevs';
        }
        return <div style={{float: 'left'}}><canvas ref={this.el}></canvas></div>
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
        setFabricData: (data) => {
            dispatch(setFabricData(data))
        },
        setActiveObject: (data) => {
            dispatch(setActiveObject(data))
        }
    }
}

const FabricControl = connect(mapStateToProps, mapDispatchToProps)(FabricControlInternal)
export default FabricControl;