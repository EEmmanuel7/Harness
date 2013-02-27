define(
[
	"jquery",
	"underscore",
	"harness/model/blockfactory",
	"harness/model/validationengine",
	"decycle"
],
function($, _, BlockFactory, ValidationEngine) {

	function Harness (containerElement)
	{
		this.Blocks = {};
		this.Views = {};
		this.Element = containerElement;
		this.Canvas = $("#raih_bg")[0];
		this.Context = this.Canvas.getContext("2d");
		this.NextBlockIdNumber = 0;
		window.addEventListener('resize', function() {harness.ResizeCanvas();}, false);
	};
	Harness.prototype.Blocks = null;
	Harness.prototype.View = null;
	Harness.prototype.BlockFactory = null;
	Harness.prototype.Canvas = null;
	Harness.prototype.Context = null;
	Harness.prototype.Element = null;
	Harness.prototype.Engine = null;
	Harness.prototype.Painter = null;
	Harness.prototype.ValidationEngine = null;
	Harness.prototype.GetNextBlockId = function() {
		return ++this.NextBlockIdNumber;
	};
	Harness.prototype.GetBlockFromAnyId = function(elementId) {
		if (elementId == undefined || elementId.length == 0) { return null; }
		var parts = elementId.split('-');
		return this.Blocks[parts[0]];
	};
	Harness.prototype.AddBlock = function (block, view) {
		this.Views[block.Id] = view;
		view.CreateMarkup(this.Element);
		this.Blocks[block.Id] = block; 
		this.Update();
		this.Validate();
		return block;
	};
	Harness.prototype.ConnectSockets = function (outputSocketId, inputSocketId)	{
		var outputInfo = outputSocketId.split('-'); 
		var inputInfo = inputSocketId.split('-');
		
		try
		{
			this.ConnectSocketAndBlock(outputInfo[0], outputInfo[3], inputInfo[0], inputInfo[3]);
		}
		catch (message)
		{
			notify.Info("Could not connect blocks", message);
		}
		
		this.Validate();
	};
	Harness.prototype.ConnectSocketAndBlock = function (outputBlockName, outputSocketName, inputBlockName, inputSocketName) {
		var outputSocket = this.Blocks[outputBlockName].Outputs[outputSocketName];
		var inputSocket = this.Blocks[inputBlockName].Inputs[inputSocketName];
		
		var connector = outputSocket.Connect(inputSocket);
		this.Painter.BuildBoundingBox(connector);
	};
	Harness.prototype.RemoveConnector = function(connectorToRemove) {
		connectorToRemove.From.Disconnect(connectorToRemove);
		connectorToRemove.To.Disconnect(connectorToRemove);
		connectorToRemove = null;

		this.Validate();
	};
	Harness.prototype.BlockIds = function() {
		var ids = Array();
		var blocks = this.Blocks;
		for(var id in blocks)
		{
			if(blocks.hasOwnProperty(id)) {    
				ids.push(id);
			}
		}
		return ids;
	};
	Harness.prototype.Validate = function() {
		this.ValidationEngine.Validate(this.Blocks);
	};
	Harness.prototype.Update = function () {	
		this.Painter.Update(this.Views, this.Blocks);
	};
	Harness.prototype.Tick = function () {
		this.Engine.Tick(this.BlockIds(), this.Blocks);
	};
	Harness.prototype.MouseMove = function (event) {
		this.Painter.Update(harness.Views, harness.Blocks, event.pageX, event.pageY);
	};
	Harness.prototype.BlocksMoved = function ()	{
		this.Painter.RebuildBoundingBoxes(harness.Blocks);
		this.Update();
	};
	Harness.prototype.ResizeCanvas = function() {
		this.Canvas.width = window.innerWidth;
		this.Canvas.height = window.innerHeight;
		this.Update();
	};
	Harness.prototype.KeyDown = function(event) {
		if (event.which == 46 && 
			this.Painter.HighlightedConnector != null)
		{
			this.RemoveConnector(this.Painter.HighlightedConnector);
			this.Update();
		}
	};

	Harness.prototype.ToJSON = function()
	{
		return JSON.stringify(JSON.decycle(this.Blocks));
	};

	Harness.prototype.Load = function(jsonBlocks)
	{
		this.Blocks = JSON.parse(JSON.retrocycle('{"ScalarSource1":{"Id":"ScalarSource1","Name":"Scalar Source","Inputs":{},"Outputs":{"Value":{"Id":"Value","Name":"Value","Connectors":[{"From":{"$ref":"$[\"ScalarSource1\"][\"Outputs\"][\"Value\"]"},"To":{"Id":"Value","Name":"Value","Connectors":[{"$ref":"$[\"ScalarSource1\"][\"Outputs\"][\"Value\"][\"Connectors\"][0]"}],"BlockId":"ScalarSink2","IsInputSocket":true,"IsRequired":true},"Id":"Value:Value"}],"BlockId":"ScalarSource1","IsInputSocket":false,"IsRequired":false}},"Data":10,"Completed":false,"InputsCount":0,"OutputsCount":1},"ScalarSink2":{"Id":"ScalarSink2","Name":"Scalar Sink","Inputs":{"Value":{"$ref":"$[\"ScalarSource1\"][\"Outputs\"][\"Value\"][\"Connectors\"][0][\"To\"]"}},"Outputs":{},"Data":"Empty","Completed":false,"InputsCount":1,"OutputsCount":0}}' ));
		this.Painter.RebuildBoundingBoxes(harness.Blocks);
		this.Update();
	}
	
	return( Harness );

});




