// How to load in modules
const Scene = require('Scene');
const NativeUI = require('NativeUI');
const Textures = require('Textures');
const Materials = require('Materials');
const Reactive = require('Reactive');
const Animation = require('Animation');
const TouchGestures = require('TouchGestures');
// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');
const sceneRoot = Scene.root;

const findConfig = { recursive: true }
// get all objects
Promise.all([
    // planes
    sceneRoot.findFirst('apparelplanetracker', findConfig),

    // textures
    Textures.findFirst('green_palm_leaves'),
    Textures.findFirst('pink_leaves_tribal'),
    Textures.findFirst('abstract_navy_blue'),
    Textures.findFirst('tartan_zebra'),

    // materials
    Materials.findFirst('greenPalmLeavesPrint'),
    Materials.findFirst('pinkLeavesTribalPrint'),
    Materials.findFirst('abstractNavyBluePrint'),
    Materials.findFirst('tartanZebraPrint'),
    Materials.findFirst('blackCotton'),
    Materials.findFirst('redCotton'),
    Materials.findFirst('greenCotton'),
    Materials.findFirst('blueCotton'),
    Materials.findFirst('whiteCotton'),

    // meshes
    sceneRoot.findFirst('Logo', findConfig),
    sceneRoot.findFirst('Outline', findConfig),
    sceneRoot.findFirst('Body', findConfig),
    sceneRoot.findFirst('Arms', findConfig),
    sceneRoot.findFirst('Bottom', findConfig),
    sceneRoot.findFirst('Girl_Tshirt', findConfig),

    // null object
    sceneRoot.findFirst('group', findConfig),

]).then(function (objects) {
    // planes
    const planeTracker = objects[0];
    // Textures
    const greenPalmTexture = objects[1];
    const pinkLeavesTexture = objects[2];
    const abstractBlueTexture = objects[3];
    const tartanZebraTexture = objects[4];

    // materials
    const greenPalmLeavesPrintMaterial = objects[5];
    const pinkLeavesTribalPrintMaterial = objects[6];
    const abstractNavyBluePrintMaterial = objects[7];
    const tartanZebraPrintMaterial = objects[8];
    const blackCottonMaterial = objects[9];
    const redCottonMaterial = objects[10];
    const greenCottonMaterial = objects[11];
    const blueCottonMaterial = objects[12];
    const whiteCottonMaterial = objects[13];

    // meshes
    const logoMesh = objects[14];
    const outlineMesh = objects[15];
    const bodyMesh = objects[16];
    const armsMesh = objects[17];
    const bottomMesh = objects[18];
    const teeMesh = objects[19];

    // null objects
    const group = objects[20];

    

    const picker = NativeUI.picker;

    const index = 0;
    const configuration = {
        selectedIndex: index,
        items: [
            { image_texture: greenPalmTexture },
            { image_texture: pinkLeavesTexture },
            { image_texture: abstractBlueTexture },
            { image_texture: tartanZebraTexture }
        ],
        mats: [
            { material: greenPalmLeavesPrintMaterial },
            { material: pinkLeavesTribalPrintMaterial },
            { material: abstractNavyBluePrintMaterial },
            { material: tartanZebraPrintMaterial }
        ]
    };
    picker.configure(configuration);

    picker.visible = Reactive.val(true);

    picker.selectedIndex.monitor().subscribe(function (index) {

        // Create an empty variable
        let solidMaterial;
        let printMaterial = configuration.mats[index.newValue].material;

        switch (index.newValue) {
            case 0: {
                solidMaterial = greenCottonMaterial;
                break;
            }
            case 1: {
                solidMaterial = blackCottonMaterial;
                break;
            }
            case 2: {
                solidMaterial = blueCottonMaterial;
                break;
            }
            case 3: {
                solidMaterial = redCottonMaterial;
                break;
            }
        }

        // switch mesh materials here
        logoMesh.material = whiteCottonMaterial;
        outlineMesh.material = printMaterial;
        bodyMesh.material = solidMaterial;
        armsMesh.material = printMaterial;
        bottomMesh.material = printMaterial;

        // apply animation
        // animation
        const changeDriverParameters = {
            durationMilliseconds: 400,
            loopCount: 1,
            mirror: true
        };
        const teeTransform = teeMesh.transform;
        const changeDriver = Animation.timeDriver(changeDriverParameters);
        changeDriver.start();
        const changeSampler = Animation.samplers.easeInQuint(0.35, 0.4);
        const changeAnimation = Animation.animate(changeDriver, changeSampler);
        teeTransform.scaleX = changeAnimation;
        teeTransform.scaleY = changeAnimation;
        teeTransform.scaleZ = changeAnimation;
    });

    // user pans and filter reacts
    TouchGestures.onPan().subscribe(function(gesture) {
        planeTracker.trackPoint(gesture.location, gesture.state);
    });

    const groupTransform = group.transform;

    // scaling apparel
    TouchGestures.onPinch().subscribeWithSnapshot( {
        'lastScaleX' : groupTransform.scaleX,
        'lastScaleY' : groupTransform.scaleY,
        'lastScaleZ' : groupTransform.scaleZ 
    }, function (gesture, snapshot) {
        groupTransform.scaleX = gesture.scale.mul(snapshot.lastScaleX);
        groupTransform.scaleY = gesture.scale.mul(snapshot.lastScaleY);
        groupTransform.scaleZ = gesture.scale.mul(snapshot.lastScaleZ);
    });

    // rotating apparel
    TouchGestures.onRotate().subscribeWithSnapshot( {
        'lastRotationY' : groupTransform.rotationY,
    }, function (gesture, snapshot) {
        const correctRotation = gesture.rotation.mul(-1);
        groupTransform.rotationY = correctRotation.add(snapshot.lastRotationY);
    });
});
