import React, { useState } from 'react';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Card from '../common/Card/Card';
import Modal from '../common/Modal/Modal';

const ComponentExamples = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Button Examples */}
      <Card title="Button Examples" subtitle="Different button variants and sizes">
        <div className="space-y-4">
          <div className="space-x-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="success">Success Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          <div className="space-x-4">
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </div>
          <Button fullWidth>Full Width Button</Button>
        </div>
      </Card>

      {/* Input Examples */}
      <Card title="Input Examples" subtitle="Different input states and variations">
        <div className="space-y-4">
          <Input
            label="Default Input"
            placeholder="Enter text here"
            name="default"
          />
          <Input
            label="Required Input"
            placeholder="This field is required"
            required
            name="required"
          />
          <Input
            label="Input with Error"
            placeholder="This input has an error"
            error="This field is required"
            name="error"
          />
          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
            name="disabled"
          />
        </div>
      </Card>

      {/* Modal Example */}
      <Card title="Modal Example" subtitle="Click the button to open a modal">
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          footer={
            <div className="flex justify-end space-x-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p>This is an example modal with a form.</p>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
        </Modal>
      </Card>
    </div>
  );
};

export default ComponentExamples; 