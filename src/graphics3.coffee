define [
    
    'lib/Three.js'
    'lib/Tween.js'
    'src/constants'
    'src/utils'

    ], (THREE, TWEEN, Const, Utils) ->

    class Graphics3

        constructor: (@_faces, @_container) ->

            @_objectQueue = []

            # A square can have multiple items but only one is shown. This is 
            # the order of precedence.
            @_itemOrder = ['food', 'snake']

            @_cameraMoveCallback = null
            @_buildScene()

        update: ->
            
            for face in @_faces
                for column in face.squares
                    for square in column
                        @_updateCube square

            TWEEN.update()
            @_renderer.render @_scene, @_camera

        show: (nextFace) ->
            
            return if nextFace is @_targetFace

            face = @_targetFace
            @_targetFace = nextFace

            start = @_camera.position[face.axis]
            obj = x: start

            new TWEEN.Tween(obj)
                .to(x: 0, 750)
                .easing(TWEEN.Easing.Quartic.Out)
                .onUpdate =>
                    @_camera.position[nextFace.axis] = @_cos obj.x
                    @_camera.position[nextFace.axis] *= @_targetFace.normal[@_targetFace.axis]
                    @_camera.position[face.axis] = obj.x
                    @_camera.lookAt @_cube.position

                    @_orientCamera(face, nextFace) if obj.x > start / 2

                .start()

        _cos: (val) ->

            Const.cameraFaceOffset * Math.cos((val * Math.PI / 2) / Const.cameraFaceOffset)

        _orientCamera: (face, nextFace) ->

            oldCameraUp = @_camera.up.clone()

            if Utils.getAxis(@_camera.up) is nextFace.axis
                @_camera.up.copy face.normal

            @_camera.up.negate() if oldCameraUp.equals nextFace.normal

        _positionAboveFace: (face) ->

            face.normal.clone().multiplyScalar Const.cameraFaceOffset

        _setupCamera: (ratio) ->

            @_camera = new THREE.PerspectiveCamera 75, ratio, 50, 10000
            @_targetFace = @_faces[Const.startFaceIndex]
            @_camera.position = @_positionAboveFace @_targetFace
            @_camera.lookAt @_cube.position
            @_scene.add @_camera

        _buildScene: ->

            @_scene = new THREE.Scene()

            geometry = new THREE.CubeGeometry Const.cubeSize, Const.cubeSize,
                Const.cubeSize
            material = new THREE.MeshLambertMaterial color: 0xA5C9F3
            @_cube = new THREE.Mesh geometry, material
            @_scene.add @_cube

            # TODO: Make this more cross-browser without bringing in jQuery
            sceneWidth = @_container.offsetWidth
            sceneHeight = @_container.offsetHeight
            @_setupCamera sceneWidth / sceneHeight

            light1 = new THREE.PointLight 0xffffff
            light1.position.set 500, 500, 500
            @_scene.add light1

            light2 = new THREE.PointLight 0xffffff
            light2.position.set -500, -500, -500
            @_scene.add light2

            @_renderer = new THREE.WebGLRenderer
            @_renderer.setSize sceneWidth, sceneHeight

            @_container.appendChild @_renderer.domElement

        _buildObject: ->

            geometry = new THREE.CubeGeometry Const.squareSize, Const.squareSize,
                Const.squareSize

            material = new THREE.MeshLambertMaterial 
            mesh = new THREE.Mesh geometry, material
            @_scene.add mesh

            mesh

        _updateCube: (square) ->

            if square.status is 'on'

                mesh = square.node or @_objectQueue.pop() or @_buildObject()
                mesh.position.copy square.position

                @_updateSquare square, mesh

            else if square.node

                @_objectQueue.unshift square.node
                square.node = null

        _updateSquare: (square, mesh) ->

            square.node = mesh

            for item in @_itemOrder
                if square.has item
                    colour = new THREE.Color Const.colours[item]
                    square.node.material.color = colour
                    return
