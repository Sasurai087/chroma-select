import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

export default class PaletteMetaForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: "form",
      newPaletteName: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.changeStage = this.changeStage.bind(this);
    this.savePalette = this.savePalette.bind(this);
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("isPaletteNameUnique", (value) =>
      this.props.palettes.every(
        ({ paletteName }) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    );
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  changeStage() {
    this.setState({
      stage: "emoji",
    });
  }

  savePalette(emoji) {
    this.props.handleSubmit({
      paletteName: this.state.newPaletteName,
      emoji: emoji.native,
    });
    this.setState({ stage: "" });
  }

  render() {
    const { newPaletteName, stage } = this.state;
    const { hideForm } = this.props;
    return (
      <div>
        <Dialog open={stage === "emoji"}>
          <DialogTitle>Choose a Palette Emoji</DialogTitle>
          <Picker
            title="Pick an emoji for your Palette!"
            onSelect={this.savePalette}
            onClose={hideForm}
          />
        </Dialog>

        <Dialog
          open={stage === "form"}
          onClose={hideForm}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Name Your Palette</DialogTitle>
          <ValidatorForm onSubmit={this.changeStage}>
            <DialogContent>
              <DialogContentText>
                Please enter a name for your new palette. Make sure it's unique!
              </DialogContentText>

              <TextValidator
                value={newPaletteName}
                label="Palette Name"
                name="newPaletteName"
                onChange={this.handleChange}
                fullWidth
                margin="normal"
                validators={["required", "isPaletteNameUnique"]}
                errorMessages={[
                  "Enter Palette Name",
                  "Palette with that name exists",
                ]}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={hideForm} color="primary">
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save Palette
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}
