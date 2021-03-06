define(
[
	'harness/views/block/blockviewbase',
	'harness/blocks/linegraphsink/linegraphsinkpropertiesview'
],

function(BlockViewBase, LineGraphSinkPropertiesView) {

	function LineGraphSinkView(block)	{
		BlockViewBase.call(this, block);
		this.Properties = new LineGraphSinkPropertiesView(block);
	}

	LineGraphSinkView.prototype = Object.create( BlockViewBase.prototype );
   	LineGraphSinkView.prototype.constructor = LineGraphSinkView;

	LineGraphSinkView.prototype.CreateContentMarkup = function ()
	{
		return '<div class="block-content">' +
					"TODO! This block is<br/> not ready for use." +
					'</div>';
	};

	LineGraphSinkView.prototype.Draw = function() {
		
	};

	return (LineGraphSinkView);
});