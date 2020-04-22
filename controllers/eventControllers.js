const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const Event = require('../models/Event');

const postEventAdd = (req, res, next) => {
  const { title, type, description, date } = req.body;
  const { id } = req.params;

  Event.create({ title, type, description, date, owner: id })
    .then(event => {
      if (!req.user.refreshToken) {
        res.redirect(`/pet/${id}`);
        return;
      }

      const { refreshToken } = req.user;
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const calendarEvent = {
        summary: title,
        description: type,
        start: { date },
        end: { date },
        colorId: 5,
      };

      calendar.events.insert({ calendarId: 'primary', resource: calendarEvent }, (err, calendarEvent) => {
        if (err) return;
        Event.findByIdAndUpdate(event._id, { googleId: calendarEvent.data.id }, { new: true }, err => {
          if (err) return;
        });
      });

      res.redirect(`/pet/${id}`);
    })
    .catch(() => res.redirect(`/pet/${id}`));
};

const postEventEdit = (req, res, next) => {
  const { title, type, description, date } = req.body;
  const { id } = req.params;

  Event.findByIdAndUpdate(id, { title, type, description, date }, { new: true })
    .then(event => {
      if (!req.user.refreshToken) {
        res.redirect(`/pet/${event.owner}`);
        return;
      }

      const { refreshToken } = req.user;
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      const calendarEvent = {
        summary: title,
        description: type,
        start: { date },
        end: { date },
        colorId: 5,
      };

      calendar.events.update(
        { calendarId: 'primary', eventId: event.googleId, resource: calendarEvent },
        (err, calendarEvent) => {
          if (err) return;
          Event.findByIdAndUpdate(event._id, { googleId: calendarEvent.data.id }, { new: true });
        }
      );

      res.redirect(`/pet/${event.owner}`);
    })
    .catch(() => {
      res.redirect(`/pet/${event.owner}`);
    });
};

const getEventDelete = (req, res, next) => {
  const { id } = req.params;

  Event.findByIdAndDelete(id)
    .then(event => {
      if (!req.user.refreshToken) {
        res.redirect(`/pet/${event.owner}`);
        return;
      }

      const { refreshToken } = req.user;
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

      calendar.events.delete({ calendarId: 'primary', eventId: event.googleId });

      res.redirect(`/pet/${event.owner}`);
    })
    .catch(() => res.redirect(`/pet/${id}`));
};

module.exports = eventController = {
  postEventAdd,
  postEventEdit,
  getEventDelete,
};
