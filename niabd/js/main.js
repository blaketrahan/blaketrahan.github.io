(function(){
    var container;
    var camera, scene, renderer, controls;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var model;
    var material;
    init();
    setTimeout(animate, 500);
    function init() {

        container = document.createElement( 'div' );
        container.className = "embed-model";
        container.id = "EmbedModel";
        document.getElementById("FillScreen").appendChild( container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight( 0xCCCCCC );
        scene.add( ambient );

        var light;
        light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        light.position.set(-200, 500, -150);
        light.position.multiplyScalar(1.3);
        light.castShadow = true;
        light.shadowCameraVisible = true;
        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;
        var d = 20;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;
        light.shadowCameraFar = 1000;
        light.shadowDarkness = 0.2;
        scene.add(light);

        var SCmaterial = new THREE.ShadowMaterial();
        SCmaterial.opacity = 0.625;
        var SCmesh = new THREE.Mesh( new THREE.PlaneGeometry(100, 100), SCmaterial );
        SCmesh.receiveShadow = true;
        SCmesh.position.y = -10.25;
        SCmesh.rotation.x = -1.570796;
        scene.add( SCmesh );

        var manager = new THREE.LoadingManager();
        var marbletexture = new THREE.Texture();
        var loader = new THREE.ImageLoader( manager );

        loader.load( 'model/texture.png', function ( image ) {

            marbletexture.image = image;
            marbletexture.needsUpdate = true;

        } );

        material = new THREE.MeshPhongMaterial( {
            map: marbletexture,
            bumpMap: marbletexture,
            bumpScale: 2,
            bumpScale: 2,
            color: new THREE.Color().setHSL( 1.0,0.15,0.82 ),
            specular: 0x333333,
            reflectivity: 1,
            shininess: 50,
        } );

        var loader = new THREE.OBJLoader( manager );
        loader.load( 'model/model.obj', function ( object ) {
            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = false;
                    child.position.y = 1;
                }
            } );
            scene.add( object );
            model = object;
        });

        renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        container.appendChild( renderer.domElement );

        // controls
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.3;
        controls.screenSpacePanning = false;
        controls.minDistance = 20;
        controls.maxDistance = 500
        controls.noZoom = true;
        controls.noPan = true;
        var angle = Math.PI / 2 - 0.25;
        controls.minPolarAngle = angle; // radians
        controls.maxPolarAngle = angle; // radians
        // controls.maxPolarAngle = Math.PI / 2;
        camera.position.set( 0, 15, 41 );
        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    function render() {
        model.rotation.y += 0.002;
        controls.update();
        renderer.render( scene, camera );
    }
})();

(function(){

    "use strict";

    var w;
    var h;

    function debounce (fn,delay) {
      let timer = null;
      
      return function()
      {
        let context = this;
        let args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function()
        {
          fn.apply(context, args);
        }, delay);
      }
    }

    /*
        Fix sections with full screen height to 
        prevent viewport height jump on mobile.
    */
    var resize = debounce(function(event) {
        var w_prev = w;
        w = window.innerWidth;
        h = window.innerHeight;

        if (w !== w_prev) {
            document.getElementById("FillScreen").style.minHeight = window.innerHeight + "px";
        }
    }, 200);
    window.addEventListener("resize", resize);
    resize();

})();


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var players = [];

var onYouTubeIframeAPIReady = function () {
    var embedded = document.getElementsByClassName("embed-video");

    for (var i = 0; i < embedded.length; i++) {

        var a_player = new YT.Player(embedded[i].children[0], 
        {
            height: '390',
            width: '640',
            videoId: embedded[i].getAttribute("data-video"),
            events: {
                onStateChange: function (event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        for (var k = 0; k < players.length; k++) {
                            if (event.target.myIndex !== k && 
                                players[k].getPlayerState() === YT.PlayerState.PLAYING) {
                                    players[k].pauseVideo();
                            }
                        }
                    }
                },
            }
        });
        a_player.myIndex = i;
        players.push(a_player);
    }
};
