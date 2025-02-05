export const showError = (msg: string) => {
  const errorList = document.getElementById('error_message_list');
  if (!errorList) return;

  const errorDiv = document.createElement('div');
  errorDiv.className =
    'bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-between shadow-lg';

  const messageSpan = document.createElement('span');
  messageSpan.textContent = msg;
  errorDiv.appendChild(messageSpan);

  const closeButton = document.createElement('button');
  closeButton.className =
    'ml-4 text-white hover:text-gray-200 text-xl font-bold';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => errorDiv.remove();
  errorDiv.appendChild(closeButton);

  setTimeout(() => {
    errorDiv.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => errorDiv.remove(), 300);
  }, 4000);

  errorList.appendChild(errorDiv);
};

export const showInfo = (msg: string) => {
  const errorList = document.getElementById('error_message_list');
  if (!errorList) return;

  const infoDiv = document.createElement('div');
  infoDiv.className =
    'bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-between shadow-lg';

  const messageSpan = document.createElement('span');
  messageSpan.textContent = msg;
  infoDiv.appendChild(messageSpan);

  const closeButton = document.createElement('button');
  closeButton.className =
    'ml-4 text-white hover:text-gray-200 text-xl font-bold';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => infoDiv.remove();
  infoDiv.appendChild(closeButton);

  setTimeout(() => {
    infoDiv.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => infoDiv.remove(), 300);
  }, 4000);

  errorList.appendChild(infoDiv);
};
