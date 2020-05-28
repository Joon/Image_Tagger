import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFabricData } from './fabricSlice';

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
            let targetX = options.target.get('gridX');
            let targetY = options.target.get('gridY');
            let distance = window.clickDistance;
            window.selectAdjacentCells(targetX, targetY, distance, window.currentClickCategory,
                window.currentClickColor, window.currentOverride);
            window.fabricCanvas.requestRenderAll();
        });

        window.selectAdjacentCells = function (targetX, targetY, distance, category, color, override) {
            let groupObjects = window.fabricCanvas.getObjects();
            for(let i = 1; i < groupObjects.length; i++) {
                let currentRect = groupObjects[i];
                let xDist = Math.abs(currentRect.get('gridX') - targetX);
                let yDist = Math.abs(currentRect.get('gridY') - targetY);
                if (xDist + yDist <= distance - 1) {
                    if (currentRect.get('category') === 'none' || override) {
                        currentRect.set('category', category);
                        currentRect.set('fill', color);
                    }
                }                    
            }
            window.fabricCanvas.requestRenderAll();
        };

        /*
            Code to find object by coordinate
            var zoom = options.target.canvas.getZoom();
            let group = options.target.canvas.getObjects()[0];
            let transform = group.calcTransformMatrix();
            let groupObjects = group.getObjects();
            let canvasOrigin = window.canvasOrigin;
            for(let i = 1; i < groupObjects.length; i++) {
                let currentRect = groupObjects[i];
                var topLeft = new fabric.Point(currentRect.left, currentRect.top);
                var bottomRight = new fabric.Point(currentRect.left + currentRect.width, currentRect.top + currentRect.height);
                var tl = fabric.util.transformPoint(topLeft, transform);
                var br = fabric.util.transformPoint(bottomRight, transform);
                var mouseX = options.e.offsetX + canvasOrigin.x;
                var mouseY = options.e.offsetY + canvasOrigin.y;
                if (tl.x < (mouseX / zoom) && br.x > (mouseX / zoom)) {
                    if (tl.y < (mouseY / zoom) && br.y > (mouseY / zoom)) {
                        currentRect.set('fill', 'pink');
                        window.fabricCanvas.requestRenderAll();
                        console.log("X: " + currentRect.get('gridX') + "   Y: " + currentRect.get('gridY') + "   |    " + currentRect.get('category'));
                    }    
                }
            }
        */

        window.fabricCanvas.on('mouse:over', (options)=> {
            if (options.target == null)
                return;
            //console.log(options.target.get('gridX') + ": " + options.target.get('gridY'));
            if (window.currentlyHighlighting) {      
                let targetX = options.target.get('gridX');
                let targetY = options.target.get('gridY');
                let distance = window.clickDistance;
                window.selectAdjacentCells(targetX, targetY, distance, window.currentClickCategory,
                    window.currentClickColor, window.currentOverride);
            }
        });

        // on mouse up lets save some state
        window.fabricCanvas.on('mouse:up', () => {
            window.currentlyHighlighting = false;
            let controlArr = window.fabricCanvas.toJSON(['gridX','gridY', 'category']);
            let objects = controlArr.objects.map((value) => { return {xCoord: value.gridX, yCoord: value.gridY, 
                category: value.category }});
            window.imageTagsDispatch(objects);
            window.fabricCanvas.requestRenderAll();
        });    
    }
        
    render() {
        window.imageTagsDispatch = this.props.setFabricData;
        let captureImage = this.props.currentImage;
        if (window.fabricCanvas) {
            var renderImage = true;
            var objects = window.fabricCanvas.getObjects();
            let fullImageZoom = 1;
            if (objects.length > 0) {
                var currentImage = objects[0].get('renderedImage');
                if (currentImage === this.props.currentImage)
                    renderImage = false;
                fullImageZoom = window.fabricCanvas.width / objects[0].width;
            }
            
            if (renderImage) {
                let captureProps = this.props;
                fabric.Image.fromURL(this.props.currentImage, function(myImg) {
                    window.fabricCanvas.clear();
                    //i create an extra var for to change some image properties
                    var img1 = myImg.set({ left: 0, top: 0});                    
                    img1.setControlsVisibility({
                        mt: false, mb: false, ml: false, mr: false, bl: false,
                        br: false, tl: false, tr: false, mtr: false, 
                    });
                    img1.lockMovementY = true;
                    img1.lockMovementX = true;
                    img1.selectable = false;
                    var gridWidth = img1.width;
                    var gridHeight = img1.height;
                            
                    window.fabricCanvas.add(img1);
        
                    var gridSize = 30; // define grid size
        
                    for(let x = Math.ceil(gridWidth/gridSize); x--;){
                        for(let y = Math.ceil(gridHeight/gridSize); y--;){
                            let currentCategory = "none";
                            let currentColor = "grey";                            
                            if (captureProps.currentClassificationData) {
                                let currentCell = captureProps.currentClassificationData.find((dataItem) => dataItem.xCoord === x && dataItem.yCoord === y);
                                if (currentCell) {
                                    currentCategory = currentCell.category;
                                    currentColor = captureProps.classificationTypes.find(category => category.type === currentCategory).color;
                                }
                            }
                            // create a rectangle object
                            var rect = new fabric.Rect({
                                left: (x * gridSize),
                                top: (y * gridSize),
                                width: gridSize,
                                height: gridSize,
                                strokeWidth: 1,
                                stroke:'black',                                
                                fill:currentColor,
                                opacity: 0.5,
                                lockMovementY: true,
                                lockMovementX: true,
                                hoverCursor: 'crosshair',
                                objectCaching: false,
                                selectable: false,
                                hasControls: false,
                                hasBorders: false
                            });
                            rect.set('category', currentCategory);
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
                    fullImageZoom = window.fabricCanvas.width / img1.width;
                    window.fabricCanvas.setZoom(fullImageZoom);  
                });
            }

            if (this.props.currentZoom !== 0) {
                window.fabricCanvas.setZoom(fullImageZoom * 2);  
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
                window.fabricCanvas.setZoom(fullImageZoom);
                window.canvasOrigin = { x: 0, y: 0 };
            }
            window.fabricCanvas.absolutePan(window.canvasOrigin);
            window.fabricCanvas.renderAll();
            window.currentOverride = this.props.currentOverride;
            window.currentClickColor = this.props.currentClassificationColor;
            window.currentClickCategory = this.props.currentClassificationName;
            window.clickDistance = this.props.currentWidth;
        }
        return <div style={{float: 'left'}}><canvas ref={this.el}></canvas></div>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {    
        currentImage: state.fabric.displayImage,
        currentClassificationData: state.fabric.fabricData,
        currentZoom: state.fabric.currentZoom,
        currentWidth: state.fabric.currentWidth,
        currentClassificationName: state.fabric.currentClassificationName,
        currentClassificationColor: state.fabric.currentClassificationColor,
        currentOverride: state.fabric.currentOverride,
        classificationTypes: state.fabric.classificationTypes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setFabricData: (data) => {
            dispatch(setFabricData(data))
        }
    }
}

const FabricControl = connect(mapStateToProps, mapDispatchToProps)(FabricControlInternal)
export default FabricControl;