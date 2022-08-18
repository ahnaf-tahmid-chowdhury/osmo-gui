from django.urls import path
from .views import *

urlpatterns = [
    path("", HLR.as_view(), name="hlr"),
    path("ajax/subscribers/",
         AjaxSubscribers.as_view(),
         name="ajax_subscribers"),
    path(
        "ajax/subscribers/last-seen/",
        AjaxSubscribersLastSeen.as_view(),
        name="ajax_subscribers_last_seen",
    ),
    path("ajax/subscribers/add/",
         AjaxAddSubscriber.as_view(),
         name="ajax_add_subscriber"),
    path(
        "ajax/subscribers/remove/",
        AjaxRemoveSubscriber.as_view(),
        name="ajax_remove_subscriber",
    ),
    path(
        "ajax/subscribers/info/",
        AjaxSubscriberInfo.as_view(),
        name="ajax_subscriber_info",
    ),
    path(
        "ajax/subscribers/update/",
        AjaxSubscriberUpdate.as_view(),
        name="ajax_subscriber_update",
    ),
]
