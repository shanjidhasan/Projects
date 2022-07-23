import torch
import torchvision
from torchvision.models.detection import _utils as det_utils
from torch.utils.mobile_optimizer import optimize_for_mobile
from functools import partial
from torchvision.models.detection.ssdlite import SSDLiteClassificationHead  # NOQA

def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press Ctrl+F8 to toggle the breakpoint.


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    # print_hi('PyCharm')
    # torchvision_model = torchvision.models.detection.ssdlite320_mobilenet_v3_large(pretrained=False)
    #
    # in_channels = det_utils.retrieve_out_channels(torchvision_model.backbone, (320, 320))
    # num_anchors = torchvision_model.anchor_generator.num_anchors_per_location()
    # norm_layer = partial(torch.nn.BatchNorm2d, eps=0.001, momentum=0.03)
    #
    # torchvision_model.head.classification_head = SSDLiteClassificationHead(
    #     in_channels,
    #     num_anchors,
    #     20,
    #     norm_layer
    # )
    # torchvision_model.load_state_dict(torch.load('SSDLite.pth', map_location='cpu'))
    # torchvision_model.eval()
    state_dict = torch.load('SSDLite.pth', 'cpu')
    state_dict.eval()
    # example = torch.rand(1, 3, 224, 224)
    # traced_script_module = torch.jit.trace(model, example)
    # traced_script_module_optimized = optimize_for_mobile(traced_script_module)
    # traced_script_module_optimized._save_for_lite_interpreter("app/src/main/assets/model.ptl")

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
