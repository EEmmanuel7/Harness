﻿define(
[
	"harness/views/templaterender",
	"text!harness/views/templates/block/properties/propertiesviewbase.html",
	"text!harness/views/templates/block/properties/propertiesinputstemplate.html",
	"text!harness/views/templates/block/properties/propertiesoutputstemplate.html",
	"stringlib"
],

function(TemplateRender, PropertiesViewBaseTemplate, PropertiesInputsTemplate, PropertiesOutputsTemplate) {

	function PropertiesViewBase(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
		this.CssClass = block.Name.replace(/ /g, '') + '-properties';
	}
	PropertiesViewBase.prototype.Block = null;
	PropertiesViewBase.prototype.Id = null;
	PropertiesViewBase.prototype.CssClass = "";

	PropertiesViewBase.prototype.Create = function() {
		var tabs = this.CreateTabs();

		var data = {
			"id": this.Id,
			"blockName": this.Block.Name,
			"propertiesCssClass": this.CssClass,
			"inputsCount": this.Block.InputsCount,
			"outputsCount": this.Block.OutputsCount,
			"tabs": tabs
		};

		harness.Element.append(
			new TemplateRender().Render(PropertiesViewBaseTemplate, data)
			);

		$("#" + this.Id + "-inputs").append(this.BuildInputs());
		$("#" + this.Id + "-outputs").append(this.BuildOutputs());

		this.BindEvents();
		this.BindMakeDataSocketEvents();
		return $("#" + this.Id);
	};

	PropertiesViewBase.prototype.BuildInputs = function() {

		var data = {
			"id" : this.Id,
			"Inputs": this.Block.Inputs
		};

		return new TemplateRender().Render(PropertiesInputsTemplate, data);
	};

	PropertiesViewBase.prototype.BuildOutputs = function() {

		var data = {
			"id" : this.Id,
			"Outputs": this.Block.Outputs
		};

		return new TemplateRender().Render(PropertiesOutputsTemplate, data);
	};

	PropertiesViewBase.prototype.ReBuildInputs = function()
	{
		var inputsContent = $("#" + this.Id + "-inputs");
		inputsContent.html("");
		inputsContent.append(this.BuildInputs());
		this.BindEvents();
	};

	PropertiesViewBase.prototype.ReBuildOutputs = function()
	{
		var outputsContent = $("#" + this.Id + "-outputs");
		outputsContent.html("");
		outputsContent.append(this.BuildOutputs());
		this.BindEvents();
	};

	PropertiesViewBase.prototype.BindMakeDataSocketEvents = function() {

		// TODO repetition below here, need to refactor out
		$("#" + this.Id + " .make-input-socket").click(function () {
			
			var propertiesControlId = $(this).attr("data-properties-id");
			var block = harness.GetBlockFromAnyId(propertiesControlId);
			var configurationPropertyId = $(this).attr("data-property-id");
			var inputBoxId = "#" + propertiesControlId + "-" + configurationPropertyId + "-value";

			var removedSocketQualifiedId = block.DeleteDataSocketByPropertyId(configurationPropertyId);
			if (removedSocketQualifiedId !== null)
			{
				var view = harness.GetBlockViewFromAnyId(propertiesControlId);
				harness.Painter.DeleteSocket(removedSocketQualifiedId);
				$(this).children(".glyphicon").remove();
				$(inputBoxId).next(".glyphicon").remove();
				return;
			}

			$(this).append('<span class="glyphicon glyphicon-ok"></span>');
			$(inputBoxId).after('<i class="glyphicon glyphicon-log-in form-control-feedback"></i>');

			var socket = block.SocketFactory.InputFromData(block, configurationPropertyId);

			block.AddInput(socket);

			var view = harness.Views[block.Id];
			harness.Painter.CreateInputSocket(block, socket.QualifiedId());
			
			view.Properties.ReBuildInputs();
      	});

	  	$("#" + this.Id + " .make-output-socket").click(function () {
			var propertiesControlId = $(this).attr("data-properties-id");
			var block = harness.GetBlockFromAnyId(propertiesControlId);
			var configurationPropertyId = $(this).attr("data-property-id");

			var inputBoxId = "#" + propertiesControlId + "-" + configurationPropertyId + "-value";

			var removedSocketQualifiedId = block.DeleteDataSocketByPropertyId(configurationPropertyId);
			if (removedSocketQualifiedId !== null)
			{
				var view = harness.GetBlockViewFromAnyId(propertiesControlId);
				harness.Painter.DeleteSocket(removedSocketQualifiedId);
				$(this).children(".glyphicon").remove();
				$(inputBoxId).next(".glyphicon").remove();
				return;
			}

			$(this).append('<span class="glyphicon glyphicon-ok"></span>');
			$(inputBoxId).after('<i class="glyphicon glyphicon-log-out form-control-feedback"></i>');

			var socket = block.SocketFactory.OutputFromData(block, configurationPropertyId);

			block.AddOutput(socket);

			var view = harness.Views[block.Id];
			harness.Painter.CreateOutputSocket(block, socket.QualifiedId());

			view.Properties.ReBuildOutputs();
      	});
	};

	PropertiesViewBase.prototype.BindEvents = function() {};
	PropertiesViewBase.prototype.CreateTabs = function() {};

	PropertiesViewBase.prototype.Update = function() {
		// When deriving your own properties view, you MUST call update inputs or outputs
		this.UpdateInputsAndOutputs();
	};

	PropertiesViewBase.prototype.UpdateInputsAndOutputs = function() {
		for(var input in this.Block.Inputs) {
			$('#' + this.Id + '-inputs-' + this.Block.Inputs[input].Id).val(
				this.Block.Inputs[input].Data
			);
		}

		for(var output in this.Block.Outputs) {
			$('#' + this.Id + '-outputs-' + this.Block.Outputs[output].Id).val(
				this.Block.Outputs[output].Data
			);
		}
	};


	return (PropertiesViewBase);
});