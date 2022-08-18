from unittest import result
from django.views.generic import TemplateView, View
from .subscribers import *
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
class HLR(TemplateView):
    template_name = "hlr.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class AjaxSubscribers(View):
    def get(self, request):
        subscribers = get_subscribers_list()
        return JsonResponse(subscribers, safe=False)


class AjaxSubscribersLastSeen(View):
    def get(self, request):
        subscribers = get_subscribers_last_seen()
        return JsonResponse(subscribers, safe=False)


class AjaxAddSubscriber(View):
    def post(self, request):
        imsi = request.POST.get("imsi")
        msisdn = request.POST.get("msisdn")
        result = add_subscriber(imsi, msisdn)
        return JsonResponse(result)


class AjaxRemoveSubscriber(View):
    def post(self, request):
        imsi = request.POST.get("imsi")
        result = remove_subscriber(imsi)
        return JsonResponse(result)


@method_decorator(csrf_exempt, name="dispatch")
class AjaxSubscriberInfo(View):
    def post(self, request):
        imsi = request.POST.get("imsi")
        result = get_subscriber_info(imsi)
        return JsonResponse(result, safe=False)


class AjaxSubscriberUpdate(View):
    def post(self, request):
        imsi = request.POST.get("imsi")
        msisdn = request.POST.get("msisdn").replace(" ", "")
        imei = request.POST.get("imei").replace(" ", "")
        aud2g = request.POST.get("aud2g")
        ki = request.POST.get("ki").replace(" ", "")
        aud3g = request.POST.get("aud3g")
        k = request.POST.get("k").replace(" ", "")
        op = request.POST.get("op").replace(" ", "")
        opc = request.POST.get("opc").replace(" ", "")
        print(imsi, msisdn, imei, aud2g, ki, aud3g, k, op, opc)
        result = update_subscriber_info(imsi, msisdn, imei, aud2g, ki, aud3g,
                                        k, op, opc)
        return JsonResponse(result, safe=False)
