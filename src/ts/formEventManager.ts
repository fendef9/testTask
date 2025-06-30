import { OnApplay } from "./OnApplay";

window.addEventListener("load", () => {
  const apply = document.getElementById(`apply`)! as HTMLButtonElement;
  const liftCapacity = document.getElementById(`lift-capacity`)! as HTMLInputElement;
  const labelLiftCapacity = document.getElementById(`label-lift-capacity`)! as HTMLLabelElement;
  const floorsCount = document.getElementById(`floors-count`)! as HTMLInputElement;
  const labelFloorsCount = document.getElementById(`label-floors-count`)! as HTMLLabelElement;

  liftCapacity.addEventListener("input", () => {
    const text = labelLiftCapacity.innerHTML;
    labelLiftCapacity.innerHTML = text.replace(/\d+/, liftCapacity.value);
  });

  floorsCount.addEventListener("input", () => {
    const text = labelFloorsCount.innerHTML;
    labelFloorsCount.innerHTML = text.replace(/\d+/, floorsCount.value);
  });

  apply.addEventListener("click", () => {
    OnApplay.handler(+liftCapacity.value, +floorsCount.value);
  });
});
