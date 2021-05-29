import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { ChromePicker } from "react-color";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles/ColorPickerFormStyles";
import chroma from "chroma-js";

class ColorPickerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentColor: "teal",
    };
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("isColorNameUnique", (value) =>
      this.props.colors.every(
        ({ name }) => name.toLowerCase() !== value.toLowerCase()
      )
    );
    ValidatorForm.addValidationRule("isColorUnique", () =>
      this.props.colors.every(({ color }) => color !== this.state.currentColor)
    );
  }

  updateCurrentColor(newColor) {
    this.setState({ currentColor: newColor.hex });
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  handleSubmit() {
    const newColor = {
      color: this.state.currentColor,
      name: this.state.newColorName,
    };
    this.props.addNewColor(newColor);
    this.setState({ newColorName: "" });
  }

  render() {
    const { paletteIsFull, classes } = this.props;
    const { currentColor, newColorName } = this.state;
    return (
      <div>
        <ChromePicker
          color={currentColor}
          onChangeComplete={this.updateCurrentColor}
          className={classes.picker}
        />
        <ValidatorForm
          onSubmit={this.handleSubmit}
          ref="form"
          instantValidate={false}
        >
          <TextValidator
            value={newColorName}
            className={classes.colorNameInput}
            name="newColorName"
            variant="filled"
            margin="normal"
            onChange={this.handleChange}
            placeholder="Color Name"
            validators={["required", "isColorNameUnique", "isColorUnique"]}
            errorMessages={[
              "This field is required",
              "That name is taken. Pick a different color name!",
              "That color exists. Please pick another color.",
            ]}
          />

          <Button
            variant="contained"
            color="primary"
            style={{
              backgroundColor: paletteIsFull ? "grey" : currentColor,
              color:
                chroma(currentColor).luminance() <= 0.08 ? "white" : "black",
            }}
            type="submit"
            disabled={paletteIsFull}
            className={classes.addColor}
          >
            {paletteIsFull ? "Palette is full!" : "Add Color"}
          </Button>
        </ValidatorForm>
      </div>
    );
  }
}

export default withStyles(styles)(ColorPickerForm);
