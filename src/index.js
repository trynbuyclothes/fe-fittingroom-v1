import "./styles.css";
//import * as THREE from "three";
import * as THREE from "./build/three.module.js";
import Stats from "./examples/jsm/libs/stats.module.js";
import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "./examples/jsm/loaders/FBXLoader.js";
import { Reflector } from "./examples/jsm/libs/Reflector.js";
import { GUI } from "dat.gui";

const params = {
  color: "#101a31"
};

var container, stats, controls;
var camera, scene, renderer, light, hemilight, spotlight;

var clock = new THREE.Clock();
var navbar_height = 80;

var mixer;

init();
animate();

function init() {
  var container = document.createElement("div");
  //var container = document.getElementById("datGui");

  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 150, 300);

  const gui = new GUI({ autoPlace: true });

  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x101a31);
  scene.background = new THREE.Color(params.color);

  gui.addColor(params, "color").onChange(function (value) {
    scene.background.set(value);
  });

  //	scene.fog = new THREE.Fog( 0x101A31, 775, 1500 );

  // ------------ HemiSphere -----------
  //                                sky color, ground color, intensity
  light = new THREE.HemisphereLight(0xffffff, 0x825b4d, 4);
  light.position.set(0, 500, 0);
  scene.add(light);

  // const data = {
  //   color: light.color.getHex(),
  //   groundColor: light.groundColor.getHex(),
  // }

  const rollup = gui.addFolder("Hemisphere");
  //rollup.addColor(data, 'groundColor').onChange(() => { light.groundColor.setHex(Number(data.groundColor.toString().replace('#', '0x'))) });

  rollup.add(light, "visible");
  rollup.add(light, "intensity", 0.0, 10.0);
  rollup.add(light.position, "x", -500, 500, 0.01);
  rollup.add(light.position, "y", -500, 500, 0.01);
  rollup.add(light.position, "z", -500, 500, 0.01);
  rollup.open();

  const helper = new THREE.HemisphereLightHelper(light, 5);
  scene.add(helper);

  // ------------ AmbientLight -----------
  /* AmbientLight
  This light globally illuminates all objects in the scene equally.
  
  This light cannot be used to cast shadows as it does not have a direction.
  */

  const params2 = {
    color: "#ffffff"
  };

  light = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(0, 500, 0);
  scene.add(light);

  const rollup2 = gui.addFolder("Ambient");
  rollup2.add(light, "visible");
  rollup2.add(light, "intensity", 0.0, 10.0);

  rollup2.addColor(params2, "color").onChange(function (value2) {
    light.color.set(value2);
  });

  rollup2.open();

  // ------------ DirectionalLight -----------

  const params1 = {
    color: "#101a31"
  };

  //light = new THREE.DirectionalLight( 0x825B4D );
  light = new THREE.DirectionalLight(params1.color);
  light.position.set(0, 200, 100);
  light.castShadow = true;
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = -100;
  light.shadow.camera.left = -120;
  light.shadow.camera.right = 120;
  scene.add(light);

  const rollup5 = gui.addFolder("Directional");
  rollup5.add(light, "visible");
  rollup5.add(light, "intensity", 0.0, 10.0);
  rollup5.add(light.position, "x", -500, 500, 0.01);
  rollup5.add(light.position, "y", -500, 500, 0.01);
  rollup5.add(light.position, "z", -500, 500, 0.01);

  rollup5.addColor(params1, "color").onChange(function (value1) {
    light.color.set(value1);
  });

  const helper1 = new THREE.DirectionalLightHelper(light, 5);
  scene.add(helper1);

  // ------------ SpotLight -----------

  // spotlight = new THREE.SpotLight(0xffa95c,4);
  // scene.add(spotlight)

  //var div = document.getElementById("datGui");
  // div.appendChild(gui.domElement);

  scene.add(new THREE.AxesHelper(500)); // Axis helper

  var loader = new FBXLoader();

  const path = require("./examples/trynbuyCatwalkcutnobumpB.fbx");

  loader.load(path, function (object) {
    //loader.load( "trynbuycatwalk1", function ( object ) {

    //		mixer = new THREE.AnimationMixer( object );

    //		var action = mixer.clipAction( object.animations[ 0 ] );
    //		action.play();
    var counter = 0;
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.renderOrder = counter;
        counter = counter + 1;
        if (child.name === "Signage_wall") {
          console.log("[DEBUG] Singage wall is detected");
          //child.material.map.image = "./examples/test.PNG";
          //child.material.shininess = 10;

          //console.log(child.material.map.name);
          //console.log(child);
        }
        // console.log("[DEBUG] Generated meshes:");
        // console.log(child);
        // console.log(child.name);
        child.material.transparent = false;
        // console.log("[DEBUG] Child material:");
        // console.log(Array.isArray(child.material));
        if (Array.isArray(child.material)) {
          for (var i = 0; i < child.material.length; i++) {
            // console.log(child.material[i]);
            child.material[i].transparent = false;
          }
        } else {
          child.material.transparent = false;
        }
        if (child.material.map) child.material.map.anisotropy = 32;
      }
    });

    scene.add(object);
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  //renderer.sortObjects = false;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - navbar_height); //delete navbar height from inner window height
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const rollup3 = gui.addFolder("Renderer");
  rollup3.add(renderer, "toneMappingExposure", 0.0, 10.0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true; // enable zoom
  //controls.minDistance = 100; // set zoom boundaries
  //controls.maxDistance = 400; // set zoom boundaries
  controls.enablePan = true; // disable pan
  //controls.enablePan = false; // disable pan
  controls.target.set(0, 100, 0); // camera setting moving origin point
  controls.maxPolarAngle = Math.PI / 2; // do not go below ground
  controls.update();

  window.addEventListener("resize", onWindowResize, false);

  // stats
  // stats = new Stats();
  // container.appendChild( stats.dom );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight - navbar_height); //delete navbar height from inner window height
}

//

function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);

  //stats.update();
}
