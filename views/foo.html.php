
<p>
    <?php echo $this->get('data') ?>
</p>

	<?php
		$data= $this->get("data");
	?>			
	<select style="width:300px" id="shaders_list">
	<?php			
		foreach ($data as $key=>$value)
		{
	?>
			<optgroup label="<?php echo $value["name"]; ?>">
	<?php
			foreach ($value["shaders"] as $key2=>$value2)
			{
	?>
			<option value="<?php echo $value2["id"]; ?>"><?php echo $value2["name"]; ?></option>
	<?php					
			}
	?>
			</optgroup>				
	<?php					
		}
	?>
	</select>
			