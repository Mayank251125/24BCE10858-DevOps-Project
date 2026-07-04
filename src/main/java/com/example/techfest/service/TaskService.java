package com.example.techfest.service;

import com.example.techfest.model.Task;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TaskService {
    private final ConcurrentHashMap<Long, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public TaskService() {
        // Pre-load default DevOps assignment tasks
        createTask(new Task(null, "Set up local Jenkins Pipeline", "Run declarative build scripts", true));
        createTask(new Task(null, "Orchestrate Kubernetes Pods", "Deploy 3 replicas with service configuration", true));
        createTask(new Task(null, "Import Grafana Dashboard", "Configure Prometheus & Graphite metric views", false));
    }

    public List<Task> getAllTasks() {
        return new ArrayList<>(tasks.values());
    }

    public Task getTaskById(Long id) {
        return tasks.get(id);
    }

    public Task createTask(Task task) {
        Long id = idGenerator.incrementAndGet();
        task.setId(id);
        tasks.put(id, task);
        return task;
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = tasks.get(id);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setCompleted(taskDetails.isCompleted());
            tasks.put(id, task);
        }
        return task;
    }

    public boolean deleteTask(Long id) {
        return tasks.remove(id) != null;
    }

    public int getActiveTaskCount() {
        int count = 0;
        for (Task t : tasks.values()) {
            if (!t.isCompleted()) {
                count++;
            }
        }
        return count;
    }
}
