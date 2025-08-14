package com.jpa.test.service;

import com.jpa.test.dto.EventDto;
import com.jpa.test.entity.Event;
import com.jpa.test.exception.EventNotFoundException;
import com.jpa.test.exception.InvalidDateException;
import com.jpa.test.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public EventDto createEvent(EventDto eventDto) {
        validateFutureDate(eventDto.getDate());

        Event event = new Event(
                eventDto.getName(),
                eventDto.getDescription(),
                eventDto.getDate(),
                eventDto.getLocation()
        );

        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }

    public Page<EventDto> getEvents(int page, int size, String name, String location, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.ASC, sortBy != null ? sortBy : "date");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Event> events = eventRepository.findEventsWithFilters(name, location, pageable);
        return events.map(this::convertToDto);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new EventNotFoundException("Event with ID " + id + " not found");
        }
        eventRepository.deleteById(id);
    }

    private void validateFutureDate(LocalDate date) {
        if (date.isBefore(LocalDate.now())) {
            throw new InvalidDateException("Event date must be in the future");
        }
    }

    private EventDto convertToDto(Event event) {
        return new EventDto(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getDate(),
                event.getLocation()
        );
    }
}