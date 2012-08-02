// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['src/grid', 'src/graph', 'src/utils', 'src/world'], function(Grid, Graph, Utils, World) {
    var Cube;
    return Cube = (function(_super) {

      __extends(Cube, _super);

      function Cube(game, length) {
        var index;
        this.game = game;
        if (length == null) {
          length = 15;
        }
        this.squaresX = this.squaresY = length;
        this._faces = (function() {
          var _i, _results;
          _results = [];
          for (index = _i = 0; _i <= 5; index = ++_i) {
            _results.push(new Grid(game, length, length));
          }
          return _results;
        })();
        this.cubeGraph = new Graph([[this._faces[2], this._faces[0]], [this._faces[2], this._faces[1]], [this._faces[2], this._faces[3]], [this._faces[2], this._faces[5]], [this._faces[3], this._faces[4]]]);
      }

      Cube.prototype._adjacentFaces = (function() {
        var orientation;
        orientation = {
          0: [4, 3, 2, 1],
          1: [0, 2, 5, 4],
          2: [0, 3, 5, 1],
          3: [0, 4, 5, 2],
          4: [0, 1, 5, 3],
          5: [2, 3, 4, 1]
        };
        return function(index) {
          var neighbours;
          neighbours = orientation[index];
          return {
            'up': neighbours[0],
            'right': neighbours[1],
            'down': neighbours[2],
            'left': neighbours[3]
          };
        };
      })();

      Cube.prototype.dropFood = function() {
        var index;
        index = Utils.randInt(0, 5);
        return this._faces[index].dropFood();
      };

      Cube.prototype.squareAt = function(pos, type, value) {
        return this._faces[pos.faceIndex].squareAt(pos, type, value);
      };

      Cube.prototype.makeWorld = function() {
        var grid, _i, _len, _ref, _results;
        _ref = this._faces;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          grid = _ref[_i];
          _results.push(grid.makeWorld());
        }
        return _results;
      };

      Cube.prototype.moduloBoundaries = function(pair) {
        pair = Cube.__super__.moduloBoundaries.call(this, pair);
        pair.faceIndex = pair.y < 0 ? this._adjacentFaces(pair.faceIndex).up : pair.x > this.length ? this._adjacentFaces(pair.faceIndex).right : pair.y > this.length ? this._adjacentFaces(pair.faceIndex).down : pair.x < 0 ? this._adjacentFaces(pair.faceIndex).left : pair.faceIndex;
        return pair;
      };

      return Cube;

    })(World);
  });

}).call(this);
