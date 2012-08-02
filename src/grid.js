// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['src/piece', 'src/pair', 'src/utils', 'src/world'], function(Piece, Pair, Utils, World) {
    var Grid;
    return Grid = (function(_super) {

      __extends(Grid, _super);

      function Grid(game, squaresX, squaresY) {
        this.game = game;
        this.squaresX = squaresX != null ? squaresX : 25;
        this.squaresY = squaresY != null ? squaresY : 15;
        this.dropFood = __bind(this.dropFood, this);

        this._squareToEdges = __bind(this._squareToEdges, this);

        this.squareWidth = 15;
        this.squareHeight = 15;
        this.pieceTypes = ['food', 'snake'];
        this._world = null;
      }

      Grid.prototype._squareToEdges = function(pos) {
        var edges,
          _this = this;
        if (this.squareHasType('snake', pos)) {
          return;
        }
        edges = [];
        this.eachAdjacentPosition(pos, function(adjacentPos, direction) {
          if (_this.squareHasType('snake', adjacentPos)) {
            return;
          }
          return edges.push([pos.toString(), adjacentPos.toString()]);
        });
        return edges;
      };

      Grid.prototype.dropFood = function(pos) {
        if (pos == null) {
          pos = Utils.randPair(this.squaresX - 1, this.squaresY - 1);
        }
        this.game.foodItems.enqueue(pos);
        if (this.foodCount > this.maxFood) {
          return this.game.foodItems.dequeue();
        }
      };

      Grid.prototype.destroyWorld = function() {
        return this.eachSquare(function(pos, square) {
          var key, piece, _results;
          _results = [];
          for (key in square) {
            piece = square[key];
            _results.push(piece.hide());
          }
          return _results;
        });
      };

      Grid.prototype.makeWorld = function() {
        var column, row, type, _i, _ref, _results;
        this._world = [];
        _results = [];
        for (row = _i = 0, _ref = this.squaresX; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
          this._world[row] = [];
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (column = _j = 0, _ref1 = this.squaresY; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; column = 0 <= _ref1 ? ++_j : --_j) {
              this._world[row][column] = {};
              _results1.push((function() {
                var _k, _len, _ref2, _results2;
                _ref2 = this.pieceTypes;
                _results2 = [];
                for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
                  type = _ref2[_k];
                  _results2.push(this._world[row][column][type] = new Piece(null, type));
                }
                return _results2;
              }).call(this));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      Grid.prototype.moduloBoundaries = function(pair) {
        return Grid.__super__.moduloBoundaries.call(this, pair);
      };

      Grid.prototype.eachSquare = function(callback) {
        var column, pos, square, x, y, _i, _len, _ref, _results;
        if (!this._world) {
          return;
        }
        _ref = this._world;
        _results = [];
        for (x = _i = 0, _len = _ref.length; _i < _len; x = ++_i) {
          column = _ref[x];
          _results.push((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (y = _j = 0, _len1 = column.length; _j < _len1; y = ++_j) {
              square = column[y];
              pos = new Pair(x, y);
              _results1.push(callback(pos, square));
            }
            return _results1;
          })());
        }
        return _results;
      };

      Grid.prototype.squareAt = function(pos, type, value) {
        if (type === void 0) {
          return this._world[pos.x][pos.y];
        }
        if (value === void 0) {
          return this._world[pos.x][pos.y][type];
        }
        return this._world[pos.x][pos.y][type] = value;
      };

      Grid.prototype.toGraph = function() {
        var graphEdges,
          _this = this;
        graphEdges = [];
        this.eachSquare(function(pos) {
          return Utils.concat(graphEdges, _this._squareToEdges(pos));
        });
        return graphEdges;
      };

      return Grid;

    })(World);
  });

}).call(this);
